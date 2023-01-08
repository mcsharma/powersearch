import * as React from "react";
import Selector from "./components/Selector";
import SelectorWithSearch from "./components/SelectorWithSearch";

interface Props<T> {
  label: string;
  values: Array<T>;
  onValuesChange: (values: Array<T>) => void;
  strEnum: { [key: string]: T };
}
export default function StringEnumValuesSelector<T extends string>({
  label,
  values,
  onValuesChange,
  strEnum,
}: Props<T>) {
  const items = React.useMemo(
    () => Object.values(strEnum).map((value) => ({ key: value, label: value })),
    []
  );
  const selection = items.filter((item) => values.includes(item.key));

  return items.length < 7 ? (
    <Selector
      label={label}
      placeholder={label}
      items={items}
      selection={selection}
      onSelectionChange={(newItems) =>
        onValuesChange(newItems.map((item) => item.key))
      }
      expandOnMount={true}
      // Implement onDone here
    />
  ) : (
    <SelectorWithSearch
      label={label}
      placeholder={label}
      items={items}
      selection={selection}
      onSelectionChange={(newItems) =>
        onValuesChange(newItems.map((item) => item.key))
      }
      expandOnMount={true}
    />
  );
}
