import { FieldBase } from "./types";
import * as React from "react";
import { schemaFields } from "../app/testSchema";
import debounce from "./utils/debounce";
import * as ReactDOM from "react-dom";
import TextInput from "./components/TextInput";
import { getRandomString } from "./utils/random";
import DropdownMenu, { MenuItem } from "./components/DropdownMenu";

interface IFieldSearchTypeahead {
  onSelect: (field: FieldBase) => void;
}
const FieldSearchTypeahead: React.FC<IFieldSearchTypeahead> = ({
  onSelect,
}) => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Array<FieldBase>>(schemaFields);
  const [activeResultIndex, setActiveResultIndex] = React.useState(0);
  const [resultsShown, setResultsShown] = React.useState(false);
  const onInputBlur = () => setResultsShown(false);
  const onInputFocus = () => setResultsShown(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownID = React.useMemo(() => getRandomString(), []);
  // Extra state, just to force another update, so that portal can render
  // after input DOM ref is set
  const [hasInputNode, setHasInputNode] = React.useState(false);

  const filterResults = React.useCallback(
    (query: string) => {
      setResults(
        schemaFields.filter((field) =>
          field.name.toLowerCase().includes(query.trim().toLowerCase())
        )
      );
      setActiveResultIndex(0);
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
        if (results.length > 0) {
          onSelect(results[activeResultIndex]);
        }
        return;
      case "ArrowDown":
      case "Down":
        if (results.length > 1) {
          setActiveResultIndex((activeResultIndex + 1) % results.length);
        }
        return;
      case "ArrowUp":
      case "Up":
        if (results.length > 1) {
          setActiveResultIndex(
            (activeResultIndex - 1 + results.length) % results.length
          );
        }
        return;
      case "Esc":
      case "Escape":
        setResultsShown(false);
    }
  };

  const onItemClick = (item: MenuItem) => {
    const selectedField = results.find((result) => result.name === item.key);
    if (selectedField) {
      onSelect(selectedField);
    }
  };

  const menuItems = React.useMemo(() => {
    return results.map((result) => ({
      label: result.name,
      key: result.name,
    }));
  }, [results]);

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
        onBlur={onInputBlur}
        onFocus={onInputFocus}
        aria-owns={dropdownID}
      />
      {inputRef.current &&
        ReactDOM.createPortal(
          <DropdownMenu
            left={inputRect?.left ?? 0}
            top={(inputRect?.top ?? 0) + inputRef.current.clientHeight + 8}
            id={dropdownID}
            shown={resultsShown}
            items={menuItems}
            label="Field Selector"
            onItemClick={onItemClick}
            activeItemIndex={activeResultIndex}
          />,
          document.body
        )}
    </>
  );
};

export default FieldSearchTypeahead;
