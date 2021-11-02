import type { AWS } from "@serverless/typescript"
import { Catcher, Retrier, Serverless } from "sls-types"

export const stepFunctionFunctions: AWS["functions"] = {
  downloadCsv: {
    handler: `src/functions/stepFunction/downloadCsv/handler.handler`,
    timeout: 900,
  },
  updateWaittimes: {
    handler: `src/functions/stepFunction/updateWaittimes/handler.handler`,
    timeout: 900,
  },
  updateLoansAndHolds: {
    handler: `src/functions/stepFunction/updateLoansAndHolds/handler.handler`,
    timeout: 900,
  },
  updateDetails: {
    handler: `src/functions/stepFunction/updateDetails/handler.handler`,
    timeout: 900,
  },
  finishSync: {
    handler: `src/functions/stepFunction/finishSync/handler.handler`,
    timeout: 900,
  },
  handleError: {
    handler: `src/functions/stepFunction/handleError/handler.handler`,
    timeout: 900,
  },
  storeLibbySession: {
    handler: `src/functions/stepFunction/storeLibbySession/handler.handler`,
    timeout: 900,
  },
}
const DefaultRetry: Retrier[] = [
  {
    ErrorEquals: ["States.ALL" as const],
    IntervalSeconds: 1,
    BackoffRate: 2,
    MaxAttempts: 3,
  },
]

const DefaultCatch: Catcher[] = [
  {
    ErrorEquals: ["States.ALL" as const],
    ResultPath: "$.error",
    Next: "HandleError",
  },
]

export const stepFunctionConfig: Serverless["stepFunctions"] = {
  stateMachines: {
    syncNotion: {
      name: "syncProcessingLibraryBooksStateMachine",
      definition: {
        StartAt: "DownloadCsv",
        States: {
          DownloadCsv: {
            Type: "Task",
            Resource: { ["Fn::GetAtt"]: ["downloadCsv", "Arn"] },
            Retry: DefaultRetry,
            Catch: DefaultCatch,
            Next: "UpdateWaittimes",
          },
          UpdateWaittimes: {
            Type: "Task",
            Resource: { ["Fn::GetAtt"]: ["updateWaittimes", "Arn"] },
            Retry: DefaultRetry,
            Catch: DefaultCatch,
            Next: "UpdateLoansAndHolds",
          },
          UpdateLoansAndHolds: {
            Type: "Task",
            Resource: { ["Fn::GetAtt"]: ["updateLoansAndHolds", "Arn"] },
            Retry: DefaultRetry,
            Catch: DefaultCatch,
            Next: "UpdateDetails",
          },
          UpdateDetails: {
            Type: "Task",
            Resource: { ["Fn::GetAtt"]: ["updateDetails", "Arn"] },
            Retry: DefaultRetry,
            Catch: DefaultCatch,
            Next: "FinishSync",
          },
          FinishSync: {
            Type: "Task",
            Resource: { ["Fn::GetAtt"]: ["finishSync", "Arn"] },
            Catch: DefaultCatch,
            End: true,
          },
          HandleError: {
            Type: "Task",
            Resource: { ["Fn::GetAtt"]: ["handleError", "Arn"] },
            Next: "FailWorkflow",
          },
          FailWorkflow: {
            Type: "Fail",
          },
        },
      },
    },
  },
}
