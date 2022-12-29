import { OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import RemoveFilterButton from "./RemoveFilterButton";
import Selector from "./components/Selector";
import { MenuItem } from "./components/DropdownMenu";
import FieldOperatorMappings from "./config/FieldOperatorMappings";

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
  const opMenuItems = React.useMemo(
    () =>
      FieldOperatorMappings[filter.field.type].map((op) => ({
        key: op,
        label: OperatorType[op].toLowerCase().replace(/_/g, " "),
      })),
    []
  );
  const [opItem, setOpItem] = React.useState<MenuItem>(opMenuItems[0]);
  const valuesLabel = valuesList(filter.values);
  return (
    <Root>
      <Token round="left" label={filter.field.name} key="field" />
      <div style={{ width: 1 }} />
      <Selector
        label="Select Operator"
        items={opMenuItems}
        selectedItem={opItem}
        onSelect={setOpItem}
      />
      <div style={{ width: 1 }} />
      <Token round="none" label={valuesLabel} key="value" />
      <div style={{ width: 1 }} />
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
