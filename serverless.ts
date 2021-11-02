import { functions } from "./src/functions"
import { Serverless } from "./sls-types"
import { stepFunctionConfig } from "@functions/stepFunction"

const serverlessConfiguration: Serverless = {
  service: "library-books",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: [
    "serverless-webpack",
    "serverless-step-functions",
    "serverless-iam-roles-per-function",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      GOODREADS_USERNAME: "${ssm:/${self:service.name}/goodreads-username}",
      GOODREADS_PASSWORD: "${ssm:/${self:service.name}/goodreads-password}",
      BUCKET_NAME: "${self:service.name}-data",
      BOOKS_JSON_KEY: "library-books.json",
      PROCESSING_BOOKS_JSON_KEY: "processing-library-books.json",
      LOCAL_STORAGE_JSON_KEY: "local-storage.json",
      OVERDRIVE_API_KEY: "${ssm:/${self:service.name}/overdrive-api-key}",
    },
    lambdaHashingVersion: "20201221",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: [
          { "Fn::GetAtt": ["DataBucket", "Arn"] },
          { "Fn::Join": ["/", [{ "Fn::GetAtt": ["DataBucket", "Arn"] }, "*"]] },
        ],
      },
      {
        Effect: "Allow",
        Action: ["states:StartExecution"],
        Resource: ["*"],
      },
    ],
  },
  functions: { ...functions },
  stepFunctions: stepFunctionConfig,
  resources: {
    Resources: {
      DataBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:provider.environment.BUCKET_NAME}",
        },
      },
    },
    Outputs: {
      SyncProcessingLibraryBooksStateMachine: {
        Value: { Ref: "SyncProcessingLibraryBooksStateMachine" },
        Description: "The ARN of the state machine",
      },
    },
  },
}

module.exports = serverlessConfiguration
