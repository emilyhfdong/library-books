export interface Book {
  goodreadsId: string
  libbyId?: string
  title: string
  author: string
  cover?: { href: string; primaryColour: string }
  description?: string
  genres?: string[]
  libraries: Library[]
}

export interface Library {
  name: string
  waittime?: string
  holdtime?: string
  loaned?: boolean
}

export interface ProcessingLibraryBooks {
  syncId: string
  step: number
  totalSteps: number
  books: Book[]
  failed?: boolean
  libraryNames: string[]
}

export interface LibraryBooks {
  updatedAt: string
  books: Book[]
  libraryNames: string[]
}
