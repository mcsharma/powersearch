import * as React from "react";
import TextInput, { ITextInput } from "./components/TextInput";
import { TOKEN_COLOR } from "./utils/constants";

interface ITextFilterInput extends ITextInput {
  inputType: "integer" | "float" | "text";
  label: string;
  onDone: (value: string) => void;
}

export default function TextFilterInput({
  inputType,
  label,
  onDone,
  value,
  onChange,
  ...remainingProps
}: ITextFilterInput) {
  const ref = React.useRef<HTMLElement>(null);

  const isValidValue = (newValue: string) => {
    switch (inputType) {
      case "integer":
        return newValue.match(/^\d*$/);
      case "float":
        return newValue.match(/^\d*\.?\d*$/);
      case "text":
        return true;
    }
  };
  const cleanValue = (newValue: string) => {
    newValue = newValue.trim();
    if (newValue.endsWith(".")) {
      newValue = newValue.slice(0, -1);
    }
    return newValue;
  };

  return (
    <TextInput
      inputRef={ref}
      placeholder={label}
      width={inputType === "text" ? "auto" : 100}
      borderRadius={0}
      borderColor={TOKEN_COLOR}
      value={value}
      onChange={(newValue) => isValidValue(newValue) && onChange(newValue)}
      onKeyDown={(e) =>
        e.key === "Enter" && !!value.trim() && onDone(cleanValue(value))
      }
      onKeyUp={(e) => {
        if (e.key == "Enter") {
          if (!value.trim() && ref.current) {
            // This is to make sure contenteditable doesn't add empty <br>s and <div>s
            ref.current.innerHTML = "";
          }
        }
      }}
      {...remainingProps}
    />
  );
}
