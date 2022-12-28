import { FieldBase, OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import TextInput from "./components/TextInput";

interface IFilterValuesInput {
  onDone: (values: Array<any>) => void;
}

const FilterValuesInput: React.FC<IFilterValuesInput> = ({ onDone }) => {
  const [value, setValue] = React.useState("");

  return (
    <TextInput
      height="100%"
      border="horizontal"
      borderColor="rgb(228, 241, 255)"
      autoGrow={true}
      value={value}
      onChange={setValue}
      placeholder="Filter values..."
      //      onBlur={() => onDone([value])}
      onEnter={() => onDone([value])}
    />
  );
};
export default FilterValuesInput;
