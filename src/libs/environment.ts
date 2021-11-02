import * as env from "env-var"

export const config = {
  goodreads: {
    username: env.get("GOODREADS_USERNAME").required().asString(),
    password: env.get("GOODREADS_PASSWORD").required().asString(),
  },
  bucketName: env.get("BUCKET_NAME").required().asString(),
  booksJsonKey: env.get("BOOKS_JSON_KEY").required().asString(),
  processingBooksJsonKey: env
    .get("PROCESSING_BOOKS_JSON_KEY")
    .required()
    .asString(),
  localStorageJsonKey: env.get("LOCAL_STORAGE_JSON_KEY").required().asString(),
  libby: {
    toronto: {
      cardNumber: env.get("TORONTO_CARD_NUMBER").required().asString(),
      pin: env.get("TORONTO_PIN").required().asString(),
    },
    calgary: {
      cardNumber: env.get("CALGARY_CARD_NUMBER").required().asString(),
      pin: env.get("CALGARY_PIN").required().asString(),
    },
  },
  overdriveApiKey: env.get("OVERDRIVE_API_KEY").required().asString(),
  stateMachineArn: env.get("STATE_MACHINE_ARN").asString(),
}
