import { Field, FieldBase, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import { schemaFields } from "../app/testSchema";
import debounce from "./util/debounce";
import * as ReactDOM from "react-dom";
import FieldSearchTypeaheadResults from "./FieldSearchTypeaheadResults";

const Input = window.styled.input`
  box-sizing: border-box;
  height: 28px;
  border: 0;
  outline: 0;
  flex-grow: 1;
  &:focus {
    outline: none!important;
  }
`;
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
  const filterResults = React.useCallback(
    (query: string) => {
      setResults(
        schemaFields.filter((field) =>
          field.name.toLowerCase().includes(query.trim().toLowerCase())
        )
      );
    },
    [schemaFields]
  );
  const filterResultsDebounced = React.useMemo(
    () => debounce(filterResults, 300),
    [filterResults]
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    filterResultsDebounced(event.target.value);
  };

  const inputRef = React.useRef<HTMLInputElement>(null);
  // Extra state, just to force another update, so that portal can render
  // after input DOM ref is set
  const [hasInputNode, setHasInputNode] = React.useState(false);
  React.useEffect(() => {
    setHasInputNode(!!inputRef.current);
  }, [!!inputRef.current]);

  return (
    <>
      <Input
        type="text"
        onChange={onChange}
        value={query}
        placeholder="Search fields.."
        ref={inputRef}
      />
      {inputRef.current &&
        ReactDOM.createPortal(
          <FieldSearchTypeaheadResults
            results={results}
            left={inputRef.current.offsetLeft}
            top={inputRef.current.offsetHeight + inputRef.current.offsetTop + 8}
            onSelect={onSelect}
          />,
          appendTo
        )}
    </>
  );
};

export default FieldSearchTypeahead;
