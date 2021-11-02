import * as fs from "fs"
import * as csv from "csv-parser"

export const TOTAL_NUMBER_OF_STEPS = 5

export const wait = (amount = 0) =>
  new Promise((resolve) => setTimeout(resolve, amount))

export const waitForFileDownload = async (filename: string) => {
  let isDone = false
  let numberOfTries = 0
  while (!isDone) {
    if (numberOfTries >= 10) {
      throw new Error("timeout waiting for file to download")
    }
    try {
      fs.readFileSync(filename)
      isDone = true
    } catch {
      wait(1000)
      numberOfTries++
    }
  }

  return
}

export const readCsvToJson = <T>(filename: string): Promise<T[]> =>
  new Promise((resolve) => {
    const results = []
    fs.createReadStream(filename)
      .pipe(csv())
      .on("data", (data: any) => results.push(data))
      .on("end", () => {
        resolve(results)
      })
  })

export const removeAccents = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export const removeBracketText = (text: string) =>
  text.replace(/\(([^)]+)\)/, "")

export const daysToWeeksText = (days: number) => {
  const roundedWeeks = Math.ceil(days / 7)
  return `${roundedWeeks} week${roundedWeeks === 1 ? "" : "s"}`
}

export const createResponse = ({
  statusCode,
  body,
}: {
  statusCode?: number
  body: any
}) => ({
  statusCode: statusCode || 200,
  body: JSON.stringify(body),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
})

export const getWaittime = ({
  isAvailable,
  luckyDayAvailableCopies,
  estimatedWaitDays,
}: {
  isAvailable: boolean
  luckyDayAvailableCopies: number
  estimatedWaitDays: number
}) => {
  if (isAvailable) return "available"
  if (luckyDayAvailableCopies) return "lucky day"

  return daysToWeeksText(estimatedWaitDays)
}
