import { config } from "@libs/environment"
import { s3 } from "@libs/s3"
import { getBrowser } from "@libs/puppeteer"

export const handler = async (_setupCode: any) => {
  const setupCode = _setupCode.toString()
  if (!setupCode || setupCode.length !== 8) {
    throw new Error("must provide 8 digit set up code")
  }
  const browser = await getBrowser()
  const page = await browser.newPage()
  console.log("going to libby")

  await page.goto("https://libbyapp.com")
  await page.waitForTimeout(1000)

  const [yesButton] = await page.$x("//span[contains(., 'Yes')]")
  if (!yesButton) {
    throw new Error("No 'Yes' button for I have a lib card")
  }
  await yesButton.click()

  await page.waitForTimeout(1000)

  const [copyButton] = await page.$x(
    "//span[contains(., 'Copy From Another Device')]"
  )
  if (!copyButton) {
    throw new Error("No 'Copy From Another Device' button")
  }
  await copyButton.click()
  await page.waitForTimeout(1000)
  console.log("entering code")
  await page.click(".chip-code-field")
  await page.keyboard.type(setupCode)
  await page.waitForTimeout(1000)
  console.log("getting local storage")
  const localStorageDara = await page.evaluate(() =>
    JSON.stringify(localStorage)
  )
  browser.close()
  console.log("storing local storage in s3")
  await s3.putObject(config.localStorageJsonKey, JSON.parse(localStorageDara))
  return
}
