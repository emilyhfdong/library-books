import { getWaittime, wait } from "@libs/utils"
import {
  Book,
  LibbySyncResponse,
  LocalStorage,
  ProcessingLibraryBooks,
  SFEvent,
} from "@libs/types"
import { getBrowser } from "@libs/puppeteer"
import { loginToLibrary } from "./utils"
import { config } from "@libs/environment"
import { TOTAL_NUMBER_OF_STEPS } from "@libs/utils"
import { s3 } from "@libs/s3"

const Fuse = require("fuse.js")

const LIBBY_HOLDS_URL = "https://libbyapp.com/shelf/holds"

export const handler = async ({ syncId }: SFEvent) => {
  console.log("getting local storage from s3")
  const localStorage = await s3.getJSONObject<LocalStorage>(
    config.localStorageJsonKey
  )
  const browser = await getBrowser()
  const page = await browser.newPage()
  console.log("logging into libraries")
  await loginToLibrary({
    page,
    previousLocalStorage: localStorage,
  })

  await page.goto(LIBBY_HOLDS_URL)
  console.log("waiting for sync response")

  const holds: {
    author: string
    title: string
    holdtime: string
  }[] = []

  let isFinishedSync = false

  const getLibraryNameFromCardId = (cardId: string) =>
    JSON.parse(localStorage["dewey:patron:card:all"]).all.find(
      (card) => card.cardId === cardId
    ).advantageKey

  page.on("response", async (response) => {
    const request = response.request()
    if (
      request
        .url()
        .includes("https://sentry-read.svc.overdrive.com/chip/sync") &&
      request.method() === "GET"
    ) {
      console.log("got sync response")
      const syncResponse: LibbySyncResponse = JSON.parse(await response.text())
      console.log(`found ${syncResponse.holds.length} holds`)

      Array.prototype.push.apply(
        holds,
        syncResponse.holds.map((book) => ({
          author: book.firstCreatorName,
          holdtime: getWaittime({
            estimatedWaitDays: book.estimatedWaitDays,
            isAvailable: book.isAvailable,
            luckyDayAvailableCopies: book.luckyDayAvailableCopies,
          }),
          libraryName: getLibraryNameFromCardId(book.cardId),
          title: book.title,
        }))
      )

      isFinishedSync = true
    }
  })

  while (!isFinishedSync) {
    await wait(1000)
  }
  browser.close()

  console.log("getting book list from s3")

  const { books, libraryNames } =
    await s3.getJSONObject<ProcessingLibraryBooks>(
      config.processingBooksJsonKey
    )

  const fuse = new Fuse(holds, {
    keys: ["title", "author"],
    includeScore: true,
    threshold: 0.6,
  })

  console.log("updating book")
  const updatedBooks: Book[] = books.map((book) => {
    const match = fuse.search(`${book.title} ${book.author}`)[0]

    if (match && match.score < 0.6) {
      const newLibraries = book.libraries.map((library) =>
        library.name === match.item.libraryName
          ? { ...library, holdtime: match.item.holdtime }
          : library
      )
      return {
        ...book,
        libraries: newLibraries,
      }
    }
    return book
  })

  const processingLibraryBooks: ProcessingLibraryBooks = {
    books: updatedBooks,
    step: 4,
    totalSteps: TOTAL_NUMBER_OF_STEPS,
    syncId,
    libraryNames,
  }

  console.log("uploading to s3")
  await s3.putObject(config.processingBooksJsonKey, processingLibraryBooks)

  return { syncId }
}
