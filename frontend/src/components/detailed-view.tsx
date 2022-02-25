import React from "react"
import { Box, Link } from "rebass"
import { Book } from "../types"
import { Modal } from "./modal"
import { LabelText, TitleText } from "./text"

interface IDetailedViewProps {
  book: Book
  clearActiveBook: () => void
}

export const DetailedView: React.FC<IDetailedViewProps> = ({
  book,
  clearActiveBook,
}) => {
  return (
    <Modal closeModal={clearActiveBook}>
      <LabelText sx={{ color: "white" }}>{book.author}</LabelText>
      <TitleText
        sx={{
          paddingX: 10,
          fontSize: 40,
          lineHeight: "75px",
          color: "white",
          paddingTop: 10,
          paddingBottom: 25,
          marginX: "-8px",
          textShadow: "2px 3px #F4ECE320",
        }}
      >
        {book.title.replace(/\(([^)]+)\)/, "")}
      </TitleText>
      <LabelText sx={{ color: "white", paddingBottom: 15 }}>
        {book.genres?.filter((genre) => genre !== "Fiction").join(", ")}
      </LabelText>
      {book.libraries.map((library) => (
        <LabelText sx={{ color: "white" }}>
          <strong>{library.name}</strong> -{" "}
          {library.holdtime ? `${library.holdtime} (H)` : library.waittime}
        </LabelText>
      ))}
      <Link
        target="_blank"
        href={`https://www.goodreads.com/book/show/${book.goodreadsId}`}
        onClick={(e) => e.stopPropagation()}
        sx={{
          fontSize: 12,
          fontWeight: 400,
          color: "white",
          letterSpacing: "2px",
          marginTop: "8px",
        }}
      >
        goodreads link
      </Link>
      {book.description && (
        <Box
          sx={{ color: "white", marginTop: 15 }}
          dangerouslySetInnerHTML={{ __html: book.description }}
        />
      )}
    </Modal>
  )
}
