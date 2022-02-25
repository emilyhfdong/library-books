import React from "react"
import { Text, TextProps } from "rebass"

interface ILabelTextProps extends TextProps {}

export const LabelText: React.FC<ILabelTextProps> = (textProps) => {
  return (
    <Text
      {...textProps}
      sx={{
        fontSize: 12,
        fontWeight: 400,
        color: "white",
        letterSpacing: "2px",
        ...textProps.sx,
      }}
    />
  )
}

interface ITitleTextProps extends TextProps {}

export const TitleText: React.FC<ITitleTextProps> = (textProps) => {
  return (
    <Text
      {...textProps}
      sx={{
        fontFamily: "LekyCalgria",
        fontSize: 50,
        lineHeight: "80px",
        ...textProps.sx,
      }}
    />
  )
}
