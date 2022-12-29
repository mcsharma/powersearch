import * as React from "react";
import DraftFilter from "./DraftFilter";
import AddedFilter from "./AddedFilter";
import FieldSearchTypeahead from "./FieldSearchTypeahead";
import { FieldBase, SimpleFilter } from "./types";
const styled = window.styled;

const Root = styled.div`
  box-sizing: border-box;
  height: 44px;
  min-width: 800px;
  padding: 4px;
  border-radius: 6px;
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
  const updateFilter = (updatedFilter: SimpleFilter<any>) => {
    setFilters(
      filters.map((filter) =>
        filter.id === updatedFilter.id ? updatedFilter : filter
      )
    );
  };

  const rootRef = React.useRef<HTMLDivElement>(null);
  // Needed to force a second render so that typeahead can render
  const [isRootRefSet, setIsRootRefSet] = React.useState(false);
  React.useEffect(() => {
    setIsRootRefSet(true);
  }, []);

  return (
    <Root ref={rootRef}>
      {filters.map((curFilter) => (
        <AddedFilter
          key={curFilter.id}
          filter={curFilter}
          onUpdate={updateFilter}
          onDelete={() => deleteFilter(curFilter.id)}
        />
      ))}
      {selectedField ? (
        <DraftFilter
          field={selectedField}
          onDone={addFilter}
          onRemove={() => setSelectedField(null)}
        />
      ) : rootRef.current ? (
        <FieldSearchTypeahead onSelect={setSelectedField} />
      ) : null}
    </Root>
  );
};

export default PowerSearch;
