import * as React from "react";
import DraftFilter from "./DraftFilter";
import AddedFilter from "./AddedFilter";
import FieldSearchTypeahead from "./FieldSearchTypeahead";
import { Field, FieldBase, OperatorType, SimpleFilter } from "./types";
const styled = window.styled;

const Root = styled.div`
  box-sizing: border-box;
  height: 40px;
  width: 800px;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  border: 1px solid lightgray;
  align-items: stretch;
  position: relative;
`;

interface IPowerSearch {
  schema: Array<FieldBase>;
}

const PowerSearch: React.FC<IPowerSearch> = ({ schema }) => {
  const [filters, setFilters] = React.useState<Array<SimpleFilter<any>>>([]);
  const [selectedField, setSelectedField] = React.useState<FieldBase | null>(
    null
  );
  const addFilter = (filter: SimpleFilter<any>) => {
    setFilters([...filters, filter]);
    setSelectedField(null);
  };
  const deleteFilter = (filterID: string) => {
    setFilters(filters.filter((filter) => filter.id !== filterID));
  };

  const rootRef = React.useRef<HTMLDivElement>(null);
  // Needed to force a second render so that typeahead can render
  const [isRootRefSet, setIsRootRefSet] = React.useState(false);
  React.useEffect(() => {
    setIsRootRefSet(true);
  }, []);

  return (
    <Root ref={rootRef}>
      {filters.map((filter) => (
        <AddedFilter
          key={filter.id}
          filter={filter}
          onDelete={() => deleteFilter(filter.id)}
        />
      ))}
      {selectedField ? (
        <DraftFilter field={selectedField} onDone={addFilter} />
      ) : rootRef.current ? (
        <FieldSearchTypeahead
          onSelect={setSelectedField}
          appendTo={rootRef.current}
        />
      ) : null}
    </Root>
  );
};

export default PowerSearch;
