import { FieldType, OperatorType } from "./types";
import * as React from "react";
import TextInput from "./components/TextInput";
import { TOKEN_COLOR } from "./utils/constants";
import BooleanValueSelector from "./BooleanValueSelector";

interface IFilterValuesInput {
  fieldType: FieldType;
  operatorType: OperatorType;
  values: Array<any>;
  onUpdate: (values: Array<any>) => void;
  onDone: (values: Array<any>) => void;
}

export default function FilterValuesInput({
  fieldType,
  values,
  onUpdate,
  onDone,
}: IFilterValuesInput) {
  const ref = React.useRef<HTMLElement>(null);

  switch (fieldType) {
    case FieldType.BOOLEAN: {
      return (
        <BooleanValueSelector
          selectedValue={values[0]}
          onSelect={(val) => {
            onDone([val]);
          }}
        />
      );
    }
    default:
  }

  return (
    <TextInput
      inputRef={ref}
      height="100%"
      border="horizontal"
      borderColor={TOKEN_COLOR}
      autoGrow={true}
      value={values[0]}
      onChange={(value) => onUpdate([value])}
      placeholder="Filter values..."
      onKeyDown={(e) =>
        e.key === "Enter" && !!values[0].trim()
          ? onDone([values[0].trim()])
          : null
      }
      onKeyUp={(e) => {
        if (e.key == "Enter") {
          if (values[0].trim() && ref.current) {
            // This is to make sure contenteditable doesn't add empty <br>s and <div>s
            ref.current.innerHTML = "";
          }
        }
      }}
    />
  );
}
