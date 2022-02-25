import React from "react"
import { Box, Flex, Image } from "rebass"
import { Book as IBook } from "../types"
import { compareLibraryWaittimes } from "../utils"
import { LabelText } from "./text"

interface IBookProps {
  book: IBook
  setActiveBook: (book: IBook) => void
}

export const Book: React.FC<IBookProps> = ({ book, setActiveBook }) => {
  const { cover } = book
  const earliestWaittimeLibrary = book.libraries.sort(
    compareLibraryWaittimes
  )[0]

  const waittimeCopy = earliestWaittimeLibrary.holdtime
    ? `${earliestWaittimeLibrary.holdtime} (H)`
    : earliestWaittimeLibrary.waittime
  const isAvailable =
    waittimeCopy && ["available", "lucky day"].includes(waittimeCopy)
  return (
    <Flex
      sx={{
        margin: [10, 15],
        alignItems: "flex-start",
        paddingRight: ["5px"],
        flexDirection: "column",
        cursor: "pointer",
      }}
      onClick={() => setActiveBook(book)}
    >
      <LabelText
        sx={{
          color: isAvailable ? "#2db552" : "#61524095",
          marginBottom: "5px",
          fontWeight: isAvailable ? "600" : "normal",
        }}
      >
        {waittimeCopy}
      </LabelText>
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Image
          src={cover?.href}
          sx={{
            height: 200,
            borderRadius: 4,
            boxShadow: "5px 5px 5px 5px #61524025",
            ...(isAvailable && {
              border: "2px solid #2db552",
              boxShadow: "5px 5px 5px 5px #2db55225",
            }),
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "2px",
            bottom: "6px",
            left: "6px",
            width: "0.5px",
            bg: "#00000015",
            boxShadow: "0px 1px 2px 2px #00000010",
          }}
        />
      </Box>
    </Flex>
  )
}
