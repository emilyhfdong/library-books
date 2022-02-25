import React, { useEffect, useState } from "react"
import { Flex, SxStyleProp } from "rebass"
import { theme } from "../theme"

interface IModalProps {
  closeModal: () => void
  sx?: SxStyleProp
}

export const Modal: React.FC<IModalProps> = ({ closeModal, children, sx }) => {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (document) {
      //@ts-expect-error
      document.querySelector("meta[name=theme-color]").content =
        "rgba(97, 82, 64, 0.98)"
    }
    setOpacity(1)
  }, [])

  return (
    <Flex
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        overflow: "scroll",
        zIndex: 1,
        bg: "rgba(97, 82, 64, 0.98)",
        transition: "0.15s opacity",
        opacity,
        flexDirection: "column",
        paddingY: 40,
        paddingX: 10,
        ...sx,
      }}
      onClick={() => {
        setOpacity(0)
        //@ts-expect-error
        document.querySelector("meta[name=theme-color]").content =
          theme.colors.background
        setTimeout(closeModal, 200)
      }}
    >
      {children}
    </Flex>
  )
}
