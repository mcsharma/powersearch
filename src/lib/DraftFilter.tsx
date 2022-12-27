import { FieldBase, OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import FilterValuesInput from "./FilterValuesInput";
import { getRandomString } from "./util/random";

const Root = window.styled.div`
  display: flex;
  &:not(:last-child) {
    margin-right: 4px;
  }
`;

interface IActiveFilter {
  field: FieldBase;
  onDone: (filter: SimpleFilter<any>) => void;
}

const DraftFilter: React.FC<IActiveFilter> = ({ field, onDone }) => {
  const [operator, setOperator] = React.useState<OperatorType>(OperatorType.IS);
  const [values, setValues] = React.useState<Array<any>>([]);
  const opLabel = OperatorType[operator].toLowerCase().replace(/_/g, " ");
  const onInputDone = (values: Array<any>) => {
    onDone({ id: getRandomString(), field, operator, values });
  };
  return (
    <Root>
      <Token round="left" label={field.name} key="field" />
      <Token round="none" label={opLabel} key="op" />
      <FilterValuesInput onDone={onInputDone} />
    </Root>
  );
};

export default DraftFilter;

const valuesList = (values: Array<any>): string => {
  if (values.length < 3) {
    return values.join(", ");
  }
  return `${values[0]} and ${values.length - 1} other values`;
};
