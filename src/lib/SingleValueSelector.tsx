import * as React from 'react'
import Autocomplete from '@mui/joy/Autocomplete'
import ValuesDisplayChip from './utils/ValuesDisplayChip'
import { EntityNames } from './utils/types'
import Chip from '@mui/joy/Chip'
import Select from '@mui/joy/Select'
import Option from '@mui/joy/Option'

interface Option {
  id: string | number | boolean
  label: string
}
interface Props {
  entityNames: EntityNames
  options: Option[]
  value: Option | undefined
  onChange: (val: Option) => void
}
export default function SingleValueSelector({
  entityNames,
  options,
  value,
  onChange,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null)
  // const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
  //   value
  // )
  const [showDropdown, setShowDropdown] = React.useState(true)
  const [showError, setShowError] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  // const handleClose = () => {
  //   if (selectedValue === undefined) {
  //     setShowError(true)
  //   }
  //   setShowDropdown(false)
  //   setAnchorEl(null)
  // }
  // const handleOpen = (anchor: HTMLButtonElement) => {
  //   setShowDropdown(true)
  //   setAnchorEl(anchor)
  // }

  // React.useLayoutEffect(() => {
  //   if (ref.current) {
  //     setAnchorEl(ref.current)
  //   }
  // }, [ref.current])

  return (
    <>
      <Select
      size="sm"
      variant='plain'
      slotProps={{
        root: {
          'borderRadius': 0
        }
      }}
        placeholder={`Search ${entityNames.singular}`}
        sx={{ width: 180 }}
      >
        {options.map((option) => (
          <Option value={option.id}>{option.label}</Option>
        ))}
      </Select>
      {/* <ValuesDisplayChip
        color={showError ? 'danger' : undefined}
        // onClick={(e) => {
        //   if (showDropdown) {
        //     handleClose()
        //   } else {
        //     handleOpen(e.currentTarget)
        //   }
        // }}
        values={selectedValue === undefined ? [] : [selectedValue]}
        entityNames={entityNames}
        selectionType="single"
      /> */}
      <Autocomplete
        variant="plain"
        size="sm"
        disableClearable
        // onBlur={() => selectedValue !== undefined && onChange(selectedValue)}
        forcePopupIcon={false}
        placeholder={`Search ${entityNames.singular}`}
        noOptionsText={`No matching ${entityNames.singular}`}
        options={options}
        value={value}
        // onSelect={(...args) => {
        //   setShowError(false)
        //   setSelectedValue(undefined)
        //   handleClose()
        // }}
        // onClose={(e, reason) => {
        //   if (reason === 'escape') {
        //     handleClose()
        //   }
        // }}
        onChange={(e, newValue, reason) => {
          console.log(e.type, newValue, reason)
          onChange(newValue)
        }}
        sx={{
          width: 180,
        }}
      />
    </>
  )
}
