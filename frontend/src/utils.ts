import { Book, Library } from "./types"

export const wait = (amount = 0) =>
  new Promise((resolve) => setTimeout(resolve, amount))

// if 1 -> b comes before a (b has a short waittime)
// if -1 -> a comes before b (a has a short waittime)
const compareWaittime = (a: string, b: string): number => {
  if (b === "available" || b === "lucky day") return 1
  if (a === "available" || a === "lucky day") return -1

  return Number(b?.replace(/[^0-9]/g, "")) < Number(a?.replace(/[^0-9]/g, ""))
    ? 1
    : -1
}

export const compareLibraryWaittimes = (a: Library, b: Library): number => {
  const aTime = a.holdtime || a.waittime || ""
  const bTime = b.holdtime || b.waittime || ""

  return compareWaittime(aTime, bTime)
}

export const compareBookWaittimes = (a: Book, b: Book): number => {
  const aEarliestWaittimeLibrary = a.libraries.sort(compareLibraryWaittimes)[0]
  const bEarliestWaittimeLibrary = b.libraries.sort(compareLibraryWaittimes)[0]

  return compareLibraryWaittimes(
    aEarliestWaittimeLibrary,
    bEarliestWaittimeLibrary
  )
}
