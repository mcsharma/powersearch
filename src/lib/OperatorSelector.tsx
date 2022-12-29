import * as React from "react";
import { MenuItem } from "./components/DropdownMenu";
import Selector from "./components/Selector";
import FieldOperatorMappings from "./config/FieldOperatorMappings";
import { FieldType, OperatorType } from "./types";

interface IOperatorSelector {
  fieldType: FieldType;
  selectedOperator: OperatorType;
  onChange: (op: OperatorType) => void;
}
export default function OperatorSelector({
  fieldType,
  selectedOperator,
  onChange,
}: IOperatorSelector) {
  const opMenuItems = React.useMemo(
    () =>
      FieldOperatorMappings[fieldType].map((op) => ({
        key: op,
        label: OperatorType[op].toLowerCase().replace(/_/g, " "),
      })),
    [fieldType]
  );

  const selectedItem = opMenuItems.find(
    (item) => item.key === selectedOperator
  ) as MenuItem;

  const onSelect = (item: MenuItem) => {
    onChange(item.key as OperatorType);
  };

  return (
    <Selector
      label="Operator Selector"
      items={opMenuItems}
      selectedItem={selectedItem}
      onSelect={onSelect}
      placeholder="Select Operator"
    />
  );
}
