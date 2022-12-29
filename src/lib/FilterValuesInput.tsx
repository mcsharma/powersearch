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
      onKeyDown={(e) =>
        e.key === "Enter" && !!value?.trim() ? onDone([value]) : null
      }
      onKeyUp={(e) => {
        if (e.key == "Enter") {
          if (!value?.trim() && ref.current) {
            // This is to make sure contenteditable doesn't add empty <br>s and <div>s
            ref.current.innerHTML = "";
          }
        }
      }}
    />
  );
};
export default FilterValuesInput;
