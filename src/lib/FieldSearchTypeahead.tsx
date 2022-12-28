import { Field, FieldBase, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import { schemaFields } from "../app/testSchema";
import debounce from "./utils/debounce";
import * as ReactDOM from "react-dom";
import FieldSearchTypeaheadResults from "./FieldSearchTypeaheadResults";
import TextInput from "./components/TextInput";

interface IFieldSearchTypeahead {
  onSelect: (field: FieldBase) => void;
  appendTo: HTMLDivElement;
}
const FieldSearchTypeahead: React.FC<IFieldSearchTypeahead> = ({
  onSelect,
  appendTo,
}) => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Array<FieldBase>>(schemaFields);
  const [activeResultIndex, setActiveResultIndex] = React.useState(0);
  const [resultsShown, setResultsShown] = React.useState(false);
  const onInputBlur = () => setResultsShown(false);
  const onInputFocus = () => setResultsShown(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
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

  const onKeyDown = (key: string) => {
    switch (key) {
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

  React.useEffect(() => {
    setHasInputNode(!!inputRef.current);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [!!inputRef.current]);

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
      />
      {inputRef.current &&
        ReactDOM.createPortal(
          <FieldSearchTypeaheadResults
            shown={resultsShown}
            results={results}
            activeResultIndex={activeResultIndex}
            left={inputRef.current.offsetLeft}
            top={inputRef.current.offsetHeight + inputRef.current.offsetTop + 5}
            onSelect={onSelect}
          />,
          appendTo
        )}
    </>
  );
};

export default FieldSearchTypeahead;
