import { FieldBase, OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import TextInput from "./components/TextInput";
import { TOKEN_COLOR } from "./utils/constants";

interface IFilterValuesInput {
  onDone: (values: Array<any>) => void;
}

const FilterValuesInput: React.FC<IFilterValuesInput> = ({ onDone }) => {
  const [value, setValue] = React.useState("");
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <TextInput
      inputRef={ref}
      height="100%"
      border="horizontal"
      borderColor={TOKEN_COLOR}
      autoGrow={true}
      value={value}
      onChange={setValue}
      placeholder="Filter values..."
      //      onBlur={() => onDone([value])}
      onKeyDown={(key) =>
        key === "Enter" && !!value?.trim() ? onDone([value]) : undefined
      }
    />
  );
};
export default FilterValuesInput;
