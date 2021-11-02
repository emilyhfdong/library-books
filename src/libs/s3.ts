import { S3 } from "aws-sdk"
import { config } from "./environment"

const _s3 = new S3()

export const s3 = {
  getJSONObject: async <T>(key: string) => {
    try {
      const s3Response = await _s3
        .getObject({
          Bucket: config.bucketName,
          Key: key,
        })
        .promise()
      const body: T = JSON.parse(s3Response.Body.toString("utf-8"))
      return body
    } catch (e) {
      if (e.code === "NoSuchKey") {
        return null
      }
      throw e
    }
  },
  putObject: (key: string, body: any) =>
    _s3
      .putObject({
        Bucket: config.bucketName,
        Key: key,
        Body: JSON.stringify(body),
        ContentType: "application/json",
      })
      .promise(),
  deleteObject: (key: string) =>
    _s3
      .deleteObject({
        Bucket: config.bucketName,
        Key: key,
      })
      .promise(),
}
