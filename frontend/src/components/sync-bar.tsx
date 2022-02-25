import { DateTime } from "luxon"
import React, { useState } from "react"
import { Flex, Text } from "rebass"
import { booksService, SyncStatus } from "../services"
import { wait } from "../utils"

interface ISyncBarProps {
  getAndSetBooks: () => void
  lastUpdated: string
}

export const SyncBar: React.FC<ISyncBarProps> = ({
  lastUpdated,
  getAndSetBooks,
}) => {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStep, setSyncStep] = useState<number | undefined>()
  const [totalSyncSteps, setTotalSyncSteps] = useState<number | undefined>()
  const [syncStatus, setSyncStatus] = useState<SyncStatus | undefined>()
  const initiateSyncAndPollForUpdate = async () => {
    await booksService.initiateSync()
    let status: SyncStatus = "PROCESSING"
    while (status !== "READY" && status !== "ERROR") {
      try {
        const { data } = await booksService.getSyncStatus()
        setSyncStep(data.step)
        setTotalSyncSteps(data.totalSteps)
        setSyncStatus(data.syncStatus)
        status = data.syncStatus
        await wait(5000)
      } catch (e) {
        console.log("error:", e)
        setSyncStatus("ERROR")
      }
    }
    setIsSyncing(false)
    if (status === "READY") {
      await getAndSetBooks()
    }
  }

  return (
    <Flex
      sx={{
        position: "absolute",
        top: "5px",
        right: "5px",
        flexDirection: "column",
        alignItems: "flex-end",
        cursor: isSyncing ? "auto" : "pointer",
        opacity: isSyncing ? 0.6 : 1,
      }}
      onClick={() => {
        if (!isSyncing) {
          setIsSyncing(true)
          initiateSyncAndPollForUpdate()
        }
      }}
    >
      <Text
        sx={{
          fontSize: "8px",
          fontWeight: 400,
          color: "#61524090",
          letterSpacing: "2px",
          marginBottom: "3px",
        }}
      >
        {DateTime.fromISO(lastUpdated).toFormat(`yyyy-M-d'T'HH:mm:ss`)}
      </Text>
      <Text
        sx={{
          fontSize: "8px",
          fontWeight: 400,
          color: "#61524090",
          letterSpacing: "2px",
          marginBottom: "3px",
        }}
      >
        {syncStatus === "PROCESSING" && `${syncStep} / ${totalSyncSteps}`}
        {syncStatus === "ERROR" && `try again`}

        <i
          style={{
            fontSize: "10px",
            color: "#61524090",
            ...(isSyncing && { animation: "rotation 3s infinite linear" }),
            marginLeft: "5px",
          }}
          className="fas fa-sync-alt"
        ></i>
      </Text>
    </Flex>
  )
}
