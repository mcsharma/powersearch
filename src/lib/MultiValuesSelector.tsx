import * as React from 'react'
import Autocomplete from '@mui/joy/Autocomplete'
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import Sheet from '@mui/joy/Sheet'
import ValuesDisplayChip from './utils/ValuesDisplayChip'
import { EntityNames } from './utils/types'

interface Props {
  entityNames: EntityNames
  options: string[]
  initialValues: string[]
  onUpdate: (values: string[]) => void
}
export default function MultiValuesSelector({
  entityNames,
  options,
  initialValues,
  onUpdate,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [selectedValues, setselectedValues] = React.useState<string[]>(initialValues)
  const [showDropdown, setShowDropdown] = React.useState(true)
  const [showError, setShowError] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClose = () => {
    if (selectedValues.length === 0) {
      setShowError(true)
    }
    setShowDropdown(false)
    setAnchorEl(null)
  }
  const handleOpen = (anchor: HTMLButtonElement) => {
    setShowDropdown(true)
    setAnchorEl(anchor)
  }

  React.useLayoutEffect(() => {
    if (ref.current) {
      setAnchorEl(ref.current)
    }
  }, [ref.current])

  return (
    <>
      <ValuesDisplayChip
        color={showError ? 'danger' : undefined}
        onClick={(e) => {
          if (showDropdown) {
            handleClose()
          } else {
            handleOpen(e.currentTarget)
          }
        }}
        values={selectedValues}
        rootRef={ref}
        entityNames={entityNames}
        selectionType="multiple"
      />
      <Popper open={showDropdown} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={handleClose}>
          <Sheet variant="plain">
            <Autocomplete
              variant="plain"
              size="sm"
              open
              autoFocus
              multiple
              disableClearable
              onBlur={() => onUpdate(selectedValues)}
              placeholder={`Search ${entityNames.plural}`}
              noOptionsText={`No matching ${entityNames.singular}`}
              options={options}
              limitTags={1}
              popupIcon={null}
              value={selectedValues}
              renderTags={() => null}
              onClose={(e, reason) => {
                if (reason === 'escape') {
                  handleClose()
                }
              }}
              onChange={(event, newValue, reason) => {
                if (
                  event.type === 'keydown' &&
                  ((event as React.KeyboardEvent).key === 'Backspace' ||
                    (event as React.KeyboardEvent).key === 'Delete') &&
                  reason === 'removeOption'
                ) {
                  return
                }
                if (newValue.length > 0) {
                  setShowError(false)
                }
                setselectedValues(newValue)
              }}
              sx={{
                width: 300,
              }}
            />
          </Sheet>
        </ClickAwayListener>
      </Popper>
    </>
  )
}
