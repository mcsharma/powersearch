import { OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import RemoveFilterButton from "./RemoveFilterButton";

interface IFilterToken {
  filter: SimpleFilter<any>;
  onDelete: () => void;
}
const Root = window.styled.div`
  display: flex;
  align-items: stretch;
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

const AddedFilter: React.FC<IFilterToken> = ({ filter, onDelete }) => {
  const opLabel = OperatorType[filter.operator]
    .toLowerCase()
    .replace(/_/g, " ");
  const valuesLabel = valuesList(filter.values);
  return (
    <Root>
      <Token round="left" label={filter.field.name} key="field" />
      <Token round="none" label={opLabel} key="op" />
      <Token round="none" label={valuesLabel} key="value" />
      <RemoveFilterButton onClick={onDelete} />
    </Root>
  );
};

export default AddedFilter;

const valuesList = (values: Array<any>): string => {
  if (values.length < 3) {
    return values.join(", ");
  }
  return `${values[0]} and ${values.length - 1} other values`;
};
