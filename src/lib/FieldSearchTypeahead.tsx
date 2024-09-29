import { FieldBase } from './types'
import * as React from 'react'
import { schemaFields } from '../app/testSchema'
import Autocomplete from '@mui/joy/Autocomplete'

interface IFieldSearchTypeahead {
  onSelect: (field: FieldBase) => void
}

export default function FieldSearchTypeahead({
  onSelect,
}: IFieldSearchTypeahead) {
  const fieldNames = schemaFields.map((s) => s.names.singular)
  const [inputValue, setInputValue] = React.useState('')
  return (
    <Autocomplete
      autoFocus
      disableClearable
      variant="plain"
      size="sm"
      placeholder="Search fields"
      inputValue={inputValue}
      onInputChange={(e, newValue) => {
        setInputValue(newValue)
      }}
      value=""
      onChange={(e, fieldName) => {
        const field = schemaFields.find((field) => field.names.singular === fieldName)
        if (field) {
          onSelect(field)
          setInputValue('')
        }
      }}
      popupIcon={null}
      options={fieldNames}
    />
  )
}

const Root = window.styled.div`
margin: 2px 0;
flex-grow: 1`
