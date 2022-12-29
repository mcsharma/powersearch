import * as React from "react";
import CaretDownIcon from "./CaretDownIcon";
import CrossIcon from "./CrossIcon";

export type IconType = "caret-down" | "cross";

interface IconProps {
  name: IconType;
  margin?: string;
  color?: string;
}

export default function Icon({ name, color, ...props }: IconProps) {
  const finalColor = color || "currentColor";
  switch (name) {
    case "caret-down":
      return <CaretDownIcon color={finalColor} {...props} />;
    case "cross":
      return <CrossIcon color={finalColor} {...props} />;
  }
}
