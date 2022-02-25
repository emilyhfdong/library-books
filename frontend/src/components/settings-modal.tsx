import { Checkbox, Radio } from "@rebass/forms"
import React from "react"
import { Box, Flex } from "rebass"
import { Modal } from "./modal"
import { LabelText, TitleText } from "./text"

interface ISettingsModalProps {
  closeModal: () => void
  libraryNames: string[]
  libraryFilters: string[]
  setLibraryFilters: (libraryFilters: string[]) => void
  sortBy: "DATE_ADDED" | "WAIT_TIME"
  setSortBy: (sortBy: "DATE_ADDED" | "WAIT_TIME") => void
}

export const SettingsModal: React.FC<ISettingsModalProps> = ({
  closeModal,
  libraryFilters,
  libraryNames,
  setLibraryFilters,
  setSortBy,
  sortBy,
}) => {
  return (
    <Modal sx={{ paddingX: 20 }} closeModal={closeModal}>
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
        Settings
      </TitleText>
      <Box onClick={(e) => e.stopPropagation()}>
        <LabelText
          sx={{
            marginBottom: "10px",
            fontWeight: "bold",
            fontSize: 14,
            letterSpacing: 0,
          }}
        >
          libraries
        </LabelText>
        {libraryNames.map((library) => {
          const isChecked = libraryFilters.includes(library)

          return (
            <CheckBoxButton
              key={library}
              onClick={() => {
                if (isChecked && libraryFilters.length === 1) {
                  return
                }
                setLibraryFilters(
                  isChecked
                    ? libraryFilters.filter((lib) => lib !== library)
                    : [...libraryFilters, library]
                )
              }}
              checked={libraryFilters.includes(library)}
              text={library}
            />
          )
        })}
        <LabelText
          sx={{
            fontSize: 14,
            marginBottom: "10px",
            marginTop: "20px",
            fontWeight: "bold",
            letterSpacing: 0,
          }}
        >
          sort by
        </LabelText>
        <RadioButton
          onClick={() => setSortBy("DATE_ADDED")}
          checked={sortBy === "DATE_ADDED"}
          text={"date added"}
        />
        <RadioButton
          onClick={() => setSortBy("WAIT_TIME")}
          checked={sortBy === "WAIT_TIME"}
          text={"wait time"}
        />
      </Box>
    </Modal>
  )
}

interface IRadioButtonProps {
  text: string
  checked: boolean
  onClick: () => void
}

export const RadioButton: React.FC<IRadioButtonProps> = ({
  onClick,
  checked,
  text,
}) => {
  return (
    <Flex onClick={onClick} sx={{ alignItems: "center", marginBottom: "5px" }}>
      <Radio onChange={onClick} sx={{ color: "white" }} checked={checked} />
      <LabelText>{text}</LabelText>
    </Flex>
  )
}

interface ICheckBoxButtonProps {
  text: string
  checked: boolean
  onClick: () => void
}

export const CheckBoxButton: React.FC<ICheckBoxButtonProps> = ({
  onClick,
  checked,
  text,
}) => {
  return (
    <Flex onClick={onClick} sx={{ alignItems: "center", marginBottom: "5px" }}>
      <Checkbox onChange={onClick} sx={{ color: "white" }} checked={checked} />
      <LabelText>{text}</LabelText>
    </Flex>
  )
}
