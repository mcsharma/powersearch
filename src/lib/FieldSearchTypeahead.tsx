import { FieldBase } from "./types";
import * as React from "react";
import { schemaFields } from "../app/testSchema";
import debounce from "./utils/debounce";
import TextInput from "./components/TextInput";
import { getRandomString } from "./utils/random";
import DropdownMenu from "./components/DropdownMenu";
import { MenuItem } from "./components/DropdownMenuBase";

interface IFieldSearchTypeahead {
  onSelect: (field: FieldBase) => void;
}
const FieldSearchTypeahead: React.FC<IFieldSearchTypeahead> = ({
  onSelect,
}) => {
  const dropdownID = React.useMemo(() => getRandomString(), []);
  const [menuShown, setMenuShown] = React.useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(0);

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Array<FieldBase>>(schemaFields);
  // Extra state, just to force another update, so that portal can render
  // after input DOM ref is set
  const [hasInputNode, setHasInputNode] = React.useState(false);

  function closeMenu() {
    setMenuShown(false);
  }
  function openMenu() {
    setMenuShown(true);
  }

  const menuItems = React.useMemo(() => {
    return results.map((result) => ({
      label: result.name,
      key: result.name,
    }));
  }, [results]);
  const onItemClick = (item: MenuItem) => {
    const selectedField = results.find((result) => result.name === item.key);
    if (selectedField) {
      onSelect(selectedField);
    }
  };

  const filterResults = React.useCallback(
    (query: string) => {
      setResults(
        schemaFields.filter((field) =>
          field.name.toLowerCase().includes(query.trim().toLowerCase())
        )
      );
      setActiveItemIndex(0);
    },
    [schemaFields]
  );
  const filterResultsDebounced = React.useMemo(
    () => debounce(filterResults, 300),
    [filterResults]
  );

  const onChange = (value: string) => {
    setQuery(value);
    filterResultsDebounced(value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        onItemClick(menuItems[activeItemIndex]);
        return;
      case "ArrowDown":
      case "Down":
        setActiveItemIndex((activeItemIndex + 1) % results.length);
        return;
      case "ArrowUp":
      case "ArrowUp":
        setActiveItemIndex(
          (activeItemIndex - 1 + results.length) % results.length
        );
        return;
      case "Esc":
      case "Escape":
        if (menuShown) {
          closeMenu();
        }
        return;
    }
  };

  React.useEffect(() => {
    setHasInputNode(!!inputRef.current);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [!!inputRef.current]);
  const inputRect = inputRef.current?.getBoundingClientRect();

  return (
    <>
      <TextInput
        height="100%"
        border="none"
        onChange={onChange}
        value={query}
        placeholder="Search fields.."
        inputRef={inputRef}
        onKeyDown={onKeyDown}
        onFocus={openMenu}
        aria-owns={dropdownID}
      />
      {inputRef.current && (
        <DropdownMenu
          shown={menuShown}
          left={inputRect?.left ?? 0}
          top={(inputRect?.top ?? 0) + inputRef.current.clientHeight + 8}
          id={dropdownID}
          label="Field Selector"
          items={menuItems}
          onItemClick={onItemClick}
          activeItemKey={results[activeItemIndex]?.name ?? null}
          // null becase once you select an element, this component
          // (field search typeahead) disappears. So we'll never need to show
          // it in selected state.
          selectedItemKey={null}
        />
      )}
    </>
  );
};

export default FieldSearchTypeahead;
