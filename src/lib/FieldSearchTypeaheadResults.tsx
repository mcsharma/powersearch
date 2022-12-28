import { Field, FieldBase, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import { schemaFields } from "../app/testSchema";
import debounce from "./utils/debounce";
import * as ReactDOM from "react-dom";
import { getRandomString } from "./utils/random";
import DropdownMenu, { MenuItem } from "./components/DropdownMenu";

interface IFieldSearchTypeaheadResults {
  shown: boolean;
  results: Array<FieldBase>;
  left: number;
  top: number;
  onSelect: (result: FieldBase) => void;
  activeResultIndex: number;
}
export default function FieldSearchTypeaheadResults({
  shown,
  results,
  left,
  top,
  onSelect,
  activeResultIndex,
}: IFieldSearchTypeaheadResults) {
  const listID = React.useMemo(() => getRandomString(), []);
  const menuItems = React.useMemo(() => {
    return results.map((result) => ({
      label: result.name,
      value: result.name,
    }));
  }, [results]);
  const onItemClick = (item: MenuItem) => {
    console.log(item);
    const selectedField = results.find((result) => result.name === item.value);
    if (selectedField) {
      onSelect(selectedField);
    }
  };

  return (
    <Root left={left} top={top}>
      <DropdownMenu
        shown={shown}
        items={menuItems}
        label="Field Selector"
        onItemClick={onItemClick}
        activeItemIndex={activeResultIndex}
      />
    </Root>
  );
}

const Root = window.styled.div.attrs(
  ({ left, top }: { left: number; top: number }) => ({
    left,
    top,
  })
)`
  position: absolute;
  left: ${(props) => `${props.left}px`};
  top: ${(props) => `${props.top}px`};
  background: transparent;
`;
