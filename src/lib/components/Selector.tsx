import * as React from "react";
import { MenuItem } from "./DropdownMenuBase";
import SelectorWithSearch from "./internal/SelectorWithSearch";
import SelectorWithoutSearch from "./internal/SelectorWithoutSearch";

export interface ISelector<T> {
  label: string;
  placeholder: string;
  items: Array<MenuItem>;
  selection: T | null;
  onSelectionChange: (selection: T) => void;
  // Optional Props *********
  withSearch?: boolean;
  expandOnMount?: boolean;
}

// For single select T is MenuItem, for multi select, T is MenuItem[]
export default function Selector<T extends Array<MenuItem> | MenuItem>({
  withSearch,
  ...remainingProps
}: ISelector<T>) {
  return withSearch ? (
    <SelectorWithSearch {...remainingProps} />
  ) : (
    <SelectorWithoutSearch {...remainingProps} />
  );
}
