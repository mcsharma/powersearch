import * as React from "react";
import TextInput from "./components/TextInput";
import { TOKEN_COLOR } from "./utils/constants";

interface ITextFilterInput {
  inputType: "integer" | "float" | "text";
  value: string;
  onUpdate: (value: string) => void;
  onDone: (value: string) => void;
  onFocus?: () => void;
}

export default function TextFilterInput({
  inputType,
  value,
  onUpdate,
  onDone,
  onFocus,
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
      onFocus={onFocus}
      inputRef={ref}
      placeholder={"Filter value"}
      width={inputType === "text" ? "auto" : 100}
      borderRadius={0}
      borderColor={TOKEN_COLOR}
      value={value}
      onChange={(newValue) => isValidValue(newValue) && onUpdate(newValue)}
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
    />
  );
}
