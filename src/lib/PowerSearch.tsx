import * as React from 'react'
import AddedFilter from './AddedFilter'
import FieldSearchTypeahead from './FieldSearchTypeahead'
import { FieldBase, OperatorType, SimpleFilter } from './types'
import getDefaultFilterValues from './utils/getDefaultFilterValues'
const styled = window.styled
import './css/index.css'
import { getRandomString } from './utils/random'

interface IPowerSearch {
  schema: Array<FieldBase>
}

const PowerSearch: React.FC<IPowerSearch> = ({ schema }) => {
  const [filters, setFilters] = React.useState<Array<SimpleFilter<any>>>([])

  const addFilter = (field: FieldBase) => {
    setFilters([
      ...filters,
      {
        id: getRandomString(),
        field,
        operator: OperatorType.IS,
        values: getDefaultFilterValues(field.type, OperatorType.IS),
      },
    ])
  }
  const deleteFilter = (filterID: string) => {
    setFilters(filters.filter((filter) => filter.id !== filterID))
  }
  const updateFilter = (updatedFilter: SimpleFilter<any>) => {
    setFilters(
      filters.map((filter) =>
        filter.id === updatedFilter.id ? updatedFilter : filter
      )
    )
  }

  return (
    <Root>
      {filters.map((curFilter) => (
        <AddedFilter
          key={curFilter.id}
          filter={curFilter}
          onUpdate={updateFilter}
          onDelete={() => deleteFilter(curFilter.id)}
        />
      ))}
      <FieldSearchTypeahead onSelect={addFilter} />
    </Root>
  )
}

export default PowerSearch

const Root = styled.div`
  box-sizing: border-box;
  width: 800px;
  padding: 2px;
  border-radius: 8px;
  display: flex;
  border: 1px solid lightgray;
  align-items: stretch;
  position: relative;
  flex-wrap: wrap;
`
