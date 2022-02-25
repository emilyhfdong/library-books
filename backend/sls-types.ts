import { AWS } from "@serverless/typescript"

// state machine types are from https://github.com/serverless-operations/serverless-step-functions/issues/370#issuecomment-840562475
type StateMachines = {
  [stateMachine: string]: {
    name: string
    definition: Definition
  }
}

type Definition = {
  Comment?: string
  StartAt: string
  States: States
}

type States = {
  [state: string]: Choice | Fail | Map | Task | Parallel | Pass | Wait
}

type StateBase = {
  Catch?: Catcher[]
  Retry?: Retrier[]
  End?: boolean
  InputPath?: string
  Next?: string
  OutputPath?: string
  ResultPath?: string
  ResultSelector?: { [key: string]: string | { [key: string]: string } }
  Type: string
}

interface Choice extends StateBase {
  Type: "Choice"
  // ChoiceRule is missing here
  Default?: string
}

interface Fail extends StateBase {
  Type: "Fail"
  Cause?: string
  Error?: string
}

interface Map extends StateBase {
  Type: "Map"
  ItemsPath: string
  Iterator: Definition
}

type Resource =
  | string
  | { "Fn::GetAtt": [string, "Arn"] }
  | { "Fn::Join": [string, Resource[]] }

interface TaskParametersForLambda {
  FunctionName?: Resource
  Payload?: {
    "token.$": string
    [key: string]: string
  }
  [key: string]: unknown
}

interface TaskParametersForStepFunction {
  StateMachineArn: Resource
  Input?: {
    "AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID.$"?: "$$.Execution.Id"
    [key: string]: string
  }
  Retry?: [{ ErrorEquals?: string[] }]
  End?: boolean
}

interface Task extends StateBase {
  Type: "Task"
  Resource: Resource
  Parameters?:
    | TaskParametersForLambda
    | TaskParametersForStepFunction
    | { [key: string]: string | { [key: string]: string } }
}

interface Pass extends StateBase {
  Type: "Pass"
  Parameters?: {
    [key: string]: string | Array<unknown> | { [key: string]: string }
  }
}

interface Parallel extends StateBase {
  Type: "Parallel"
  Branches: Definition[]
}

interface Wait extends StateBase {
  Type: "Wait"
  Next?: string
  Seconds: number
}

export type Catcher = {
  ErrorEquals: ErrorName[]
  Next: string
  ResultPath?: string
}

export type Retrier = {
  ErrorEquals: ErrorName[]
  IntervalSeconds?: number
  MaxAttempts?: number
  BackoffRate?: number
}

type ErrorName =
  | "States.ALL"
  | "States.DataLimitExceeded"
  | "States.Runtime"
  | "States.Timeout"
  | "States.TaskFailed"
  | "States.Permissions"

export interface Serverless extends AWS {
  stepFunctions?: {
    stateMachines: StateMachines
    activities?: string[]
    validate?: boolean
  }
}
