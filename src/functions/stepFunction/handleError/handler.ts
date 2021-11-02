import { config } from "@libs/environment"
import { s3 } from "@libs/s3"
import { ProcessingLibraryBooks } from "@libs/types"

export const handler = async () => {
  const processingLibraryBooks = await s3.getJSONObject<ProcessingLibraryBooks>(
    config.processingBooksJsonKey
  )
  const updatedBooks: ProcessingLibraryBooks = {
    ...processingLibraryBooks,
    failed: true,
  }
  await s3.putObject(config.processingBooksJsonKey, updatedBooks)
  return
}
