import { config } from "@libs/environment"
import {
  Book,
  LocalStorage,
  ProcessingLibraryBooks,
  SFEvent,
} from "@libs/types"
import { getAuthorsName, getBookWaitTimeAndImg } from "./utils"
import { TOTAL_NUMBER_OF_STEPS } from "@libs/utils"
import { s3 } from "@libs/s3"

export const handler = async ({ syncId }: SFEvent) => {
  console.log("getting local storage from s3")
  const localStorage = await s3.getJSONObject<LocalStorage>(
    config.localStorageJsonKey
  )
  console.log("getting books from s3")
  const { books } = await s3.getJSONObject<ProcessingLibraryBooks>(
    config.processingBooksJsonKey
  )

  const libraryNames: string[] = JSON.parse(
    localStorage["dewey:patron:card:all"]
  ).all.map((card) => card.advantageKey)

  console.log("getting book details for", libraryNames)

  const getBookWithLibraryWaittimes = async (book: Book): Promise<Book> => {
    const authorsName = await getAuthorsName(book.author)
    const libraries = await Promise.all(
      libraryNames.map((lib) =>
        getBookWaitTimeAndImg({ author: authorsName, title: book.title }, lib)
      )
    )
    const libbyId = libraries[0].id
    const cover = libraries.find((library) => library.img)?.img
    return {
      ...book,
      cover,
      libbyId,
      libraries: libraries.map((lib) => ({
        waittime: lib.waittime,
        name: lib.libraryName,
      })),
    }
  }

  const updatedBooks = await Promise.all(
    books.map((book) => getBookWithLibraryWaittimes(book))
  )
  const processingLibraryBooks: ProcessingLibraryBooks = {
    books: updatedBooks,
    step: 3,
    totalSteps: TOTAL_NUMBER_OF_STEPS,
    syncId,
    libraryNames,
  }
  console.log("updating books in s3")
  s3.putObject(config.processingBooksJsonKey, processingLibraryBooks)

  return { syncId }
}
