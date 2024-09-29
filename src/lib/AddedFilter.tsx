import { OperatorType, SimpleFilter } from './types'
import * as React from 'react'
import OperatorSelector from './OperatorSelector'
import Chip from '@mui/joy/Chip'
import { Close } from '@mui/icons-material'
import MultiValuesSelector from './MultiValuesSelector'
import USAStates from '../app/USAStates'
import { roundModeToBorderRadius } from './utils/roundModeToBorderRadius'
import { RoundMode } from './utils/types'
import FilterValuesInput from './FilterValuesInput'
import SingleValueSelector from './SingleValueSelector'
import FieldOperatorMappings from './config/FieldOperatorMappings'

interface IFilterToken {
  filter: SimpleFilter<any>
  onUpdate: (newFilter: SimpleFilter<any>) => void
  onDelete: () => void
}

const AddedFilter: React.FC<IFilterToken> = ({
  filter,
  onDelete,
  onUpdate,
}) => {
  const options = React.useMemo(
    () => FieldOperatorMappings[filter.field.type].map(toOption),
    [filter.field.type]
  )

  return (
    <Root>
      <Chip sx={{ borderRadius: roundModeToBorderRadius[RoundMode.left] }}>
        {filter.field.names.singular}
      </Chip>
      <div style={{ width: 2 }} />
      <OperatorSelector
        fieldType={filter.field.type}
        selectedOperator={filter.operator}
        onChange={(op) => onUpdate({ ...filter, operator: op })}
      />
      <SingleValueSelector
        entityNames={filter.field.names}
        options={options}
        value={toOption(filter.operator)}
        onChange={(newOption) => onUpdate({ ...filter, operator: newOption.id as OperatorType })}
      />
      <div style={{ width: 2 }} />
      <FilterValuesInput
        field={filter.field}
        operatorType={filter.operator}
        values={filter.values}
        onUpdate={(newValues) => onUpdate({ ...filter, values: newValues })}
      />
      <div style={{ width: 2 }} />
      <Chip
        sx={{ borderRadius: roundModeToBorderRadius[RoundMode.right] }}
        endDecorator={<Close fontSize="small" />}
        onClick={onDelete}
      />
    </Root>
  )
}

function toOption(op: OperatorType) {
  return {
    id: op,
    label: OperatorType[op].toLowerCase().replace(/_/g, ' '),
  }
}

export default AddedFilter

const Root = window.styled.div`
  display: flex;
  margin: 2px;
`
