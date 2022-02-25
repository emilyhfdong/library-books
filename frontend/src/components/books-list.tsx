import React from "react"
import { Flex } from "rebass"
import { Book as IBook } from "../types"
import { Book } from "./book"

interface IBooksListProps {
  books: IBook[]
  setActiveBook: (book: IBook) => void
}

export const BooksList: React.FC<IBooksListProps> = ({
  books,
  setActiveBook,
}) => {
  return (
    <Flex
      sx={{
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {books.map((book) => (
        <Book
          key={book.goodreadsId}
          book={book}
          setActiveBook={setActiveBook}
        />
      ))}
    </Flex>
  )
}
