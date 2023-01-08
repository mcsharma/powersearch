import * as React from "react";
import Selector from "./components/Selector";

interface Props {
  selectedValue: boolean;
  onSelect: (value: boolean) => void;
}
export default function BooleanValueSelector({
  selectedValue,
  onSelect,
}: Props) {
  const menuItems = React.useMemo(
    () => [
      { key: 1, label: "true" },
      { key: 0, label: "false" },
    ],
    []
  );

  return (
    <Selector
      label="Boolean Value Selector"
      items={menuItems}
      selection={menuItems.find((item) => !!item.key === selectedValue) ?? null}
      onSelectionChange={(item) => onSelect(!!item.key)}
      placeholder="Select Value"
      expandOnMount={true}
    />
  );
}
