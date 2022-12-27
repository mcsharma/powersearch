import { FieldBase, OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";

const Input = window.styled.input`
  box-sizing: border-box;
  height: 28px;
  border: 0;
  outline: 0;
  flex-grow: 1;
  &:focus {
    outline: none!important;
  }
`;

interface IFilterValuesInput {
  onDone: (values: Array<any>) => void;
}

const FilterValuesInput: React.FC<IFilterValuesInput> = ({ onDone }) => {
  const [value, setValue] = React.useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Input
      type="text"
      placeholder="Filter values..."
      onChange={onChange}
      onBlur={() => onDone([value])}
      onKeyDown={(evt) => (evt.key == "Enter" ? onDone([value]) : null)}
    />
  );
};
export default FilterValuesInput;
