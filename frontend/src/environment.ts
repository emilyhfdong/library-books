import * as env from "env-var"

export const config = {
  booksServiceUrl: env.get("REACT_APP_BOOKS_SERVICE_URL").required().asString(),
}
