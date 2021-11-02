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
  overdriveApiKey: env.get("OVERDRIVE_API_KEY").required().asString(),
  stateMachineArn: env.get("STATE_MACHINE_ARN").asString(),
}
