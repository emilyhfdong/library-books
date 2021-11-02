import type { AWS } from "@serverless/typescript"
import { apiFunctions } from "./api"
import { stepFunctionFunctions } from "./stepFunction"

export const functions: AWS["functions"] = {
  ...apiFunctions,
  ...stepFunctionFunctions,
}
