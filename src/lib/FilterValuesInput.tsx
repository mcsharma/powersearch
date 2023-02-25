import { FieldBase, FieldType, OperatorType } from "./types";
import * as React from "react";
import TextInput from "./components/TextInput";
import { TOKEN_COLOR } from "./utils/constants";
import BooleanValueSelector from "./BooleanValueSelector";
import StringEnumValuesSelector from "./StringEnumValuesSelector";
import USAStates from "../app/USAStates";

interface IFilterValuesInput {
  field: FieldBase;
  operatorType: OperatorType;
  values: Array<any>;
  onUpdate: (values: Array<any>) => void;
  onDone: (values: Array<any>) => void;
}

export default function FilterValuesInput({
  field,
  values,
  onUpdate,
  onDone,
}: IFilterValuesInput) {
  const ref = React.useRef<HTMLElement>(null);

  switch (field.type) {
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
    case FieldType.STRING_ENUM:
      return (
        <StringEnumValuesSelector
          label={`Select ${field.name}`}
          values={values}
          onUpdate={onUpdate}
          onDone={onDone}
          strEnum={USAStates}
        />
      );
    default:
  }

  return (
    <TextInput
      inputRef={ref}
      placeholder="Filter values..."
      width="auto"
      borderRadius={0}
      borderColor={TOKEN_COLOR}
      value={values[0]}
      onChange={(value) => onUpdate([value])}
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
