import axios from "axios"
import { config } from "../environment"
import { LibraryBooks } from "../types"

export type SyncStatus = "PROCESSING" | "ERROR" | "READY"

interface SyncStatusResponse {
  syncStatus: SyncStatus
  syncId?: string
  step?: number
  totalSteps?: number
}

const baseURL = config.booksServiceUrl
export const booksService = {
  getBooks: () => axios.get<LibraryBooks>("books", { baseURL }),
  getSyncStatus: () => axios.get<SyncStatusResponse>("status", { baseURL }),
  initiateSync: () => axios.post<{ syncId: string }>("sync", {}, { baseURL }),
}
