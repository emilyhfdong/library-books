import { config } from "@libs/environment"
import { s3 } from "@libs/s3"
import { ProcessingLibraryBooks } from "@libs/types"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"

export const handler: APIGatewayProxyHandler = async () => {
  const processingLibraryBooks = await s3.getJSONObject<ProcessingLibraryBooks>(
    config.processingBooksJsonKey
  )
  if (processingLibraryBooks) {
    const { step, syncId, totalSteps } = processingLibraryBooks
    return createResponse({
      body: {
        syncStatus: processingLibraryBooks.failed ? "ERROR" : "PROCESSING",
        syncId,
        step,
        totalSteps,
      },
    })
  }

  return createResponse({
    body: {
      syncStatus: "READY",
    },
  })
}
