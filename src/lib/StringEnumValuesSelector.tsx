import * as React from "react";
import TypeaheadSelector from "./components/TypeaheadSelector";
import Token from "./Token";
import valuesList from "./utils/valuesList";

interface Props<T> {
  label: string;
  values: Array<T>;
  onUpdate: (values: Array<T>) => void;
  onDone: (values: Array<T>) => void;
  strEnum: { [key: string]: T };
}
export default function StringEnumValuesSelector<T extends string>({
  label,
  values,
  onUpdate,
  onDone,
  strEnum,
}: Props<T>) {
  const items = React.useMemo(
    () => Object.values(strEnum).map((value) => ({ key: value, label: value })),
    []
  );
  const selection = items.filter((item) => values.includes(item.key));
  const onDropdownClose = React.useCallback(() => {
    if (values.length > 0) {
      onDone(values);
    }
  }, [values]);
  return (
    <TypeaheadSelector
      label={label}
      placeholder={label}
      items={items}
      selection={selection}
      onSelectionChange={(newItems) =>
        onUpdate(newItems.map((item) => item.key) as T[])
      }
      expandOnMount={true}
      onDropdownClose={onDropdownClose}
    />
  );
}
