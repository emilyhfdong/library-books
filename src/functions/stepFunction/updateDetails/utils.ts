import { Book, OverdriveDetailResponse } from "@libs/types"
import axios from "axios"

export const getBookDetails = async (book: Book): Promise<Book> => {
  if (!book.libbyId) {
    return book
  }

  const url = `https://thunder.api.overdrive.com/v2/media/bulk?titleIds=${book.libbyId}`

  const response = await axios.get<OverdriveDetailResponse>(url)
  return {
    ...book,
    description: response.data[0].fullDescription,
    genres: response.data[0].subjects.map((subject) => subject.name),
  }
}
