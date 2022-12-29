import { FieldBase, OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import FilterValuesInput from "./FilterValuesInput";
import { getRandomString } from "./utils/random";
import RemoveFilterButton from "./RemoveFilterButton";
import Selector from "./components/Selector";
import FieldOperatorMappings from "./config/FieldOperatorMappings";
import { MenuItem } from "./components/DropdownMenu";

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
  const opMenuItems = React.useMemo(
    () =>
      FieldOperatorMappings[field.type].map((op) => ({
        key: op,
        label: OperatorType[op].toLowerCase().replace(/_/g, " "),
      })),
    []
  );
  const [opItem, setOpItem] = React.useState<MenuItem>(opMenuItems[0]);
  const onInputDone = (values: Array<any>) => {
    onDone({
      id: getRandomString(),
      field,
      operator: opItem.key as OperatorType,
      values,
    });
  };

  return (
    <Root>
      <Token round="left" label={field.name} key="field" />
      <div style={{ width: 1 }} />
      <Selector
        label="Operator Selector"
        items={opMenuItems}
        selectedItem={opItem}
        onSelect={setOpItem}
        placeholder="Select Operator"
      />
      <FilterValuesInput onDone={onInputDone} />
      <RemoveFilterButton onClick={onRemove} />
    </Root>
  );
};

export default DraftFilter;
