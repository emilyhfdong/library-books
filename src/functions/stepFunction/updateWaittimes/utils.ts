import { config } from "@libs/environment"
import { OverdriveSearchResponse } from "@libs/types"
import { getWaittime, removeAccents, removeBracketText } from "@libs/utils"
import axios from "axios"

export const getAuthorsName = async (name: string) => {
  const url = `https://autocomplete.api.overdrive.com/v1/autocomplete?query=${removeAccents(
    name
  )}&sortBy=score&categorySize=12&maxSize=12&mediaType=ebook&mediaType=audiobook&mediaType=magazine&api-key=${
    config.overdriveApiKey
  }`
  const response = await axios.get(url)
  const author = response.data.items[0]
  return author ? author.text : ""
}

export const getBookWaitTimeAndImg = async (
  book: { title: string; author: string },
  libraryName: string
) => {
  const url = `https://thunder.api.overdrive.com/v2/libraries/${libraryName}/media?query=${encodeURIComponent(
    `${removeAccents(book.author)} ${removeBracketText(book.title)}`
  )}&format=ebook-overdrive,ebook-media-do,audiobook-overdrive,magazine-overdrive&page=1&perPage=24`
  const response = await axios.get<OverdriveSearchResponse>(url)
  const eBook = response.data.items.find((item) => item.type.id === "ebook")

  if (!eBook) {
    return { waittime: "not available", libraryName }
  }

  return {
    waittime: getWaittime({
      estimatedWaitDays: eBook.estimatedWaitDays,
      isAvailable: eBook.isAvailable,
      luckyDayAvailableCopies: eBook.luckyDayAvailableCopies,
    }),
    img: {
      href: eBook.covers.cover510Wide.href,
      primaryColour: eBook.covers.cover510Wide.primaryColor.hex,
    },
    id: eBook.id,
    libraryName,
  }
}
