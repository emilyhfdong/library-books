import {
  readCsvToJson,
  TOTAL_NUMBER_OF_STEPS,
  waitForFileDownload,
} from "@libs/utils"
import { config } from "@libs/environment"
import {
  Book,
  GoodreadsBook,
  ProcessingLibraryBooks,
  SFEvent,
} from "@libs/types"
import { getBrowser } from "@libs/puppeteer"
import { s3 } from "@libs/s3"

const EXPORT_URL = "https://www.goodreads.com/review/import"
const SIGN_IN_URL = "https://www.goodreads.com/user/sign_in"
const DOWNLOAD_CSV_FILENAME = "/tmp/" + "goodreads_library_export.csv"

export const handler = async ({ syncId }: SFEvent) => {
  console.log("launching browser")
  const browser = await getBrowser()
  console.log("creating new page")
  const page = await browser.newPage()

  // login
  console.log("logging in")
  await page.goto(SIGN_IN_URL)
  await page.click("#user_email")
  await page.keyboard.type(config.goodreads.username)
  await page.click("#user_password")
  await page.keyboard.type(config.goodreads.password)
  await page.click(".gr-button--large")
  await page.waitForNavigation()

  // export
  console.log("going to export page")
  await page.goto(EXPORT_URL)
  await page.waitForSelector(".js-LibraryExport")
  console.log("exporting file")
  await page.click(".js-LibraryExport")
  await page.waitForSelector("#exportFile a")
  console.log("finished exporting file")

  //@ts-expect-error
  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: "/tmp/",
  })
  console.log("downloading file")
  await page.click("#exportFile a")
  console.log("waiting for file to download")
  await waitForFileDownload(DOWNLOAD_CSV_FILENAME)
  console.log("finished downloading csv")

  await browser.close()

  const grBooks = await readCsvToJson<GoodreadsBook>(DOWNLOAD_CSV_FILENAME)

  const toReadBooks = grBooks.filter(
    (book) => book["Exclusive Shelf"] === "to-read"
  )

  const formattedBooks: Book[] = toReadBooks.map((book) => ({
    goodreadsId: book["Book Id"],
    author: book.Author,
    title: book.Title,
    libraries: [],
  }))

  const ProcessingLibraryBooks: ProcessingLibraryBooks = {
    books: formattedBooks,
    step: 2,
    totalSteps: TOTAL_NUMBER_OF_STEPS,
    syncId,
  }
  await s3.putObject(config.processingBooksJsonKey, ProcessingLibraryBooks)

  return { syncId }
}
