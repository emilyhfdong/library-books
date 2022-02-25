import { config } from "@libs/environment"
import { getBookDetails } from "./utils"
import { ProcessingLibraryBooks, SFEvent } from "@libs/types"
import { TOTAL_NUMBER_OF_STEPS } from "@libs/utils"
import { s3 } from "@libs/s3"

export const handler = async ({ syncId }: SFEvent) => {
  console.log("getting books from s3")
  const { books, libraryNames } =
    await s3.getJSONObject<ProcessingLibraryBooks>(
      config.processingBooksJsonKey
    )

  console.log("getting book details")
  const updatedBooks = await Promise.all(
    books.map((book) => getBookDetails(book))
  )

  const processingLibraryBooks: ProcessingLibraryBooks = {
    books: updatedBooks,
    step: 5,
    totalSteps: TOTAL_NUMBER_OF_STEPS,
    syncId,
    libraryNames,
  }

  await s3.putObject(config.processingBooksJsonKey, processingLibraryBooks)

  return { syncId }
}
