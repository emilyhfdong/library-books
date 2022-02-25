import { config } from "@libs/environment"
import { s3 } from "@libs/s3"
import { ProcessingLibraryBooks } from "@libs/types"

export const handler = async () => {
  const { books, libraryNames } =
    await s3.getJSONObject<ProcessingLibraryBooks>(
      config.processingBooksJsonKey
    )

  await s3.putObject(config.booksJsonKey, {
    updatedAt: new Date(),
    books,
    libraryNames,
  })
  await s3.deleteObject(config.processingBooksJsonKey)

  return
}
