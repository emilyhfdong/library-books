import { Page } from "puppeteer-core"

export const loginToLibrary = async ({
  previousLocalStorage,
  page,
}: {
  previousLocalStorage: any
  page: Page
}) => {
  await page.goto("https://libbyapp.com")
  await page.waitForTimeout(1000)

  await page.evaluate((newLocalStorage) => {
    for (const key in newLocalStorage) {
      localStorage.setItem(key, newLocalStorage[key])
    }
  }, previousLocalStorage)

  await page.goto("https://libbyapp.com")
  await page.waitForTimeout(1000)
}
