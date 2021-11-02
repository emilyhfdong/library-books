import { config } from "@libs/environment"
import { APIGatewayProxyHandler } from "aws-lambda"
import StepFunctions from "aws-sdk/clients/stepfunctions"
import { v4 as uuidv4 } from "uuid"
import { ProcessingLibraryBooks } from "@libs/types"
import { s3 } from "@libs/s3"
import { createResponse, TOTAL_NUMBER_OF_STEPS } from "@libs/utils"

const sf = new StepFunctions()

export const handler: APIGatewayProxyHandler = async () => {
  console.log("initiated sync")
  const processingLibraryBooks = await s3.getJSONObject<ProcessingLibraryBooks>(
    config.processingBooksJsonKey
  )

  if (processingLibraryBooks && !processingLibraryBooks.failed) {
    return createResponse({
      body: {
        syncId: processingLibraryBooks.syncId,
        message: "sync already started",
      },
    })
  }

  const syncId = uuidv4()

  console.log("starting step function")
  await sf
    .startExecution({
      name: syncId,
      stateMachineArn: config.stateMachineArn,
      input: JSON.stringify({ syncId }),
    })
    .promise()

  const processingBooks: ProcessingLibraryBooks = {
    syncId,
    step: 1,
    totalSteps: TOTAL_NUMBER_OF_STEPS,
    books: [],
    libraryNames: [],
  }

  await s3.putObject(config.processingBooksJsonKey, processingBooks)

  return createResponse({
    body: { syncId, message: "sync initiated" },
  })
}
