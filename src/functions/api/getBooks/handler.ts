import { config } from "@libs/environment"
import { s3 } from "@libs/s3"
import { LibraryBooks } from "@libs/types"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"

export const handler: APIGatewayProxyHandler = async () => {
  const libraryBooks = await s3.getJSONObject<LibraryBooks>(config.booksJsonKey)
  return createResponse({ body: libraryBooks })
}
