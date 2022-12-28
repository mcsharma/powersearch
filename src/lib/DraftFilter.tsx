import { FieldBase, OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import FilterValuesInput from "./FilterValuesInput";
import { getRandomString } from "./utils/random";
import RemoveFilterButton from "./RemoveFilterButton";

const Root = window.styled.div`
  display: flex;
  &:not(:last-child) {
    margin-right: 4px;
  }
`;

interface IActiveFilter {
  field: FieldBase;
  onDone: (filter: SimpleFilter<any>) => void;
  onRemove: () => void;
}

const DraftFilter: React.FC<IActiveFilter> = ({ field, onDone, onRemove }) => {
  const [operator, setOperator] = React.useState<OperatorType>(OperatorType.IS);
  const opLabel = OperatorType[operator].toLowerCase().replace(/_/g, " ");
  const onInputDone = (values: Array<any>) => {
    onDone({ id: getRandomString(), field, operator, values });
  };
  return (
    <Root>
      <Token round="left" label={field.name} key="field" />
      <div style={{ width: 1 }} />
      <Token round="none" label={opLabel} key="op" />
      <FilterValuesInput onDone={onInputDone} />
      <RemoveFilterButton onClick={onRemove} />
    </Root>
  );
};

export default DraftFilter;
