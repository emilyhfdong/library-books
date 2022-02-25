import type { AWS } from "@serverless/typescript"

export const apiFunctions: AWS["functions"] = {
  initiateSync: {
    handler: `src/functions/api/initiateSync/handler.handler`,
    timeout: 30,
    events: [
      {
        // schedule: {
        //   rate: "cron(0 10 * * ? *)",
        //   enabled: true,
        // },
        http: { method: "POST", path: "sync", cors: true },
      },
    ],
    environment: {
      STATE_MACHINE_ARN:
        "${self:resources.Outputs.SyncProcessingLibraryBooksStateMachine.Value}",
    },
  },
  getBooks: {
    handler: `src/functions/api/getBooks/handler.handler`,
    timeout: 30,
    events: [
      {
        http: { method: "GET", path: "books", cors: true },
      },
    ],
  },
  getSyncStatus: {
    handler: `src/functions/api/getSyncStatus/handler.handler`,
    timeout: 30,
    events: [
      {
        http: { method: "GET", path: "status", cors: true },
      },
    ],
  },
}
