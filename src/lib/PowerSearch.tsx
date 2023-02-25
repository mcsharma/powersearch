import * as React from "react";
import DraftFilter from "./DraftFilter";
import AddedFilter from "./AddedFilter";
import FieldSearchTypeahead from "./FieldSearchTypeahead";
import { FieldBase, OperatorType, SimpleFilter } from "./types";
import getDefaultFilterValues from "./utils/getDefaultFilterValues";
const styled = window.styled;

interface IPowerSearch {
  schema: Array<FieldBase>;
}

const PowerSearch: React.FC<IPowerSearch> = ({ schema }) => {
  const [filters, setFilters] = React.useState<Array<SimpleFilter<any>>>([]);
  const [draftFilter, setDraftFilter] =
    React.useState<SimpleFilter<any> | null>(null);

  const onFieldSelect = (field: FieldBase) => {
    setDraftFilter({
      id: "draft",
      field,
      operator: OperatorType.IS,
      values: getDefaultFilterValues(field.type, OperatorType.IS),
    });
  };
  const addFilter = (filter: SimpleFilter<any>) => {
    setFilters([...filters, filter]);
    setDraftFilter(null);
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
      {draftFilter ? (
        <DraftFilter
          filter={draftFilter}
          onUpdate={setDraftFilter}
          onDone={addFilter}
          onRemove={() => setDraftFilter(null)}
        />
      ) : rootRef.current ? (
        <FieldSearchTypeahead onSelect={onFieldSelect} />
      ) : null}
    </Root>
  );
};

export default PowerSearch;

const Root = styled.div`
  box-sizing: border-box;
  width: 800px;
  padding: 2px;
  border-radius: 6px;
  display: flex;
  border: 1px solid lightgray;
  align-items: stretch;
  position: relative;
  flex-wrap: wrap;
`;

