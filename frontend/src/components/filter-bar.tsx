import React from "react"
import { Flex } from "rebass"
import { LabelText } from "./text"

interface IFilterBarProps {
  openSettingsModal: () => void
  libraryNames: string[]
  libraryFilters: string[]
  sortBy: "WAIT_TIME" | "DATE_ADDED"
}

export const FilterBar: React.FC<IFilterBarProps> = ({
  openSettingsModal,
  libraryFilters,
  libraryNames,
  sortBy,
}) => {
  return (
    <Flex onClick={openSettingsModal}>
      {libraryNames.length === libraryFilters.length ? (
        <FilterPill text="all libraries" />
      ) : (
        libraryFilters.map((libraryName) => <FilterPill text={libraryName} />)
      )}

      <FilterPill
        text={sortBy === "WAIT_TIME" ? "shortest wait" : "date added"}
      />
    </Flex>
  )
}

interface IFilterPillProps {
  text: string
}

export const FilterPill: React.FC<IFilterPillProps> = ({ text }) => {
  return (
    <Flex
      sx={{
        marginX: "5px",
        bg: "#615240",
        paddingY: "5px",
        paddingX: "10px",
        borderRadius: 3,
        ":active": { opacity: 0.8 },
        boxShadow: "2px 3px #61524020",
        cursor: "pointer",
      }}
    >
      <LabelText>{text}</LabelText>
    </Flex>
  )
}
