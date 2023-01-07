import * as React from "react";
import Selector from "./components/Selector";
import SelectorWithSearch from "./components/SelectorWithSearch";

interface Props<T> {
  label: string;
  values: Array<T>;
  onSelect: (value: string) => void;
  onUnselect: (value: string) => void;
  strEnum: { [key: string]: T };
}
export default function StringEnumValuesSelector<T extends string>({
  label,
  values,
  onSelect,
  onUnselect,
  strEnum,
}: Props<T>) {
  const items = React.useMemo(
    () => Object.keys(strEnum).map((key) => ({ key, label: strEnum[key] })),
    []
  );
  const selectedItem = items.find((item) => item.key === values[0]) ?? null;

  return items.length < 7 ? (
    <Selector
      label={label}
      placeholder={label}
      items={items}
      selectedItem={selectedItem}
      onSelect={(item) => onSelect(item.key as string)}
      expandOnMount={true}
    />
  ) : (
    <SelectorWithSearch
      label={label}
      placeholder={label}
      items={items}
      selectedItem={selectedItem}
      onSelect={(item) => onSelect(item.key as string)}
      expandOnMount={true}
    />
  );
}
