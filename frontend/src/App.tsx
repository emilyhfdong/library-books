import React, { useEffect, useState } from "react"
import { Book as IBook } from "./types"
import { booksService } from "./services"
import { Box, Flex } from "rebass"
import { DetailedView } from "./components/detailed-view"
import { SyncBar } from "./components/sync-bar"
import { BooksList } from "./components/books-list"
import { TitleText } from "./components/text"
import { FilterBar } from "./components/filter-bar"
import { compareBookWaittimes } from "./utils"
import { SettingsModal } from "./components/settings-modal"

export const App: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([])
  const [lastUpdated, setLastUpdated] = useState("")
  const [libraryNames, setLibraryNames] = useState<string[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [sortBy, setSortBy] = useState<"DATE_ADDED" | "WAIT_TIME">("DATE_ADDED")
  const [libraryFilters, setLibraryFilters] = useState<string[]>([])
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)

  const [activeBook, setActiveBook] = useState<IBook | null>(null)

  const getAndSetBooks = async () => {
    try {
      const response = await booksService.getBooks()
      setBooks(response.data.books.filter((book) => book.cover))
      setLastUpdated(response.data.updatedAt)
      setLibraryNames(response.data.libraryNames)
      setLibraryFilters(response.data.libraryNames)
      setLoading(false)
    } catch (e) {
      console.log("error: ", e)
      setLoading(false)
      setError(true)
    }
  }

  useEffect(() => {
    getAndSetBooks()
  }, [])

  const filteredBooks = books
    .map((book) => ({
      ...book,
      libraries: book.libraries.filter((bookLibrary) =>
        libraryFilters.includes(bookLibrary.name)
      ),
    }))
    .sort((a, b) => (sortBy === "DATE_ADDED" ? 1 : compareBookWaittimes(a, b)))

  if (loading) {
    return null
  }

  if (error) {
    return <div>error</div>
  }

  return (
    <Flex
      sx={{
        flexDirection: "column",
        paddingX: [10, 30],
        paddingY: 40,
        height: "100vh",
        overflow: activeBook ? "hidden" : "scroll",
        position: "relative",
      }}
    >
      {activeBook && (
        <DetailedView
          clearActiveBook={() => setActiveBook(null)}
          book={activeBook}
        />
      )}
      {settingsModalOpen && (
        <SettingsModal
          closeModal={() => setSettingsModalOpen(false)}
          libraryFilters={libraryFilters}
          libraryNames={libraryNames}
          setLibraryFilters={setLibraryFilters}
          setSortBy={setSortBy}
          sortBy={sortBy}
        />
      )}
      <SyncBar lastUpdated={lastUpdated} getAndSetBooks={getAndSetBooks} />
      <Box sx={{ paddingX: 10, paddingBottom: 15 }}>
        <TitleText
          sx={{
            paddingBottom: 30,
            color: "#615240",
            textShadow: "2px 3px #61524020",
          }}
        >
          Books <Box as="br" sx={{ display: ["block", "none"] }} />
          to read
        </TitleText>
        <FilterBar
          libraryFilters={libraryFilters}
          libraryNames={libraryNames}
          openSettingsModal={() => setSettingsModalOpen(true)}
          sortBy={sortBy}
        />
      </Box>
      <BooksList books={filteredBooks} setActiveBook={setActiveBook} />
    </Flex>
  )
}
