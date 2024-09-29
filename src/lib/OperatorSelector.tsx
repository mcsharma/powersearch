import * as React from 'react'
import FieldOperatorMappings from './config/FieldOperatorMappings'
import { FieldType, OperatorType } from './types'
import Autocomplete from '@mui/joy/Autocomplete'
import Edit from '@mui/icons-material/Edit'
import Chip from '@mui/joy/Chip'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import Popper from '@mui/material/Popper'
import Sheet from '@mui/joy/Sheet'

interface IOperatorSelector {
  fieldType: FieldType
  selectedOperator: OperatorType
  onChange: (op: OperatorType) => void
}

export default function OperatorSelector({
  fieldType,
  selectedOperator,
  onChange,
}: IOperatorSelector) {
  const opMenuItems = React.useMemo(
    () =>
      FieldOperatorMappings[fieldType].map((op) => ({
        id: op,
        label: toOpString(op),
      })),
    [fieldType]
  )
  const handleClose = () => {
    setShowDropdown(false)
    setAnchorEl(null)
  }

  const [showDropdown, setShowDropdown] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  return (
    <>
      <Chip
        sx={{ borderRadius: 0 }}
        endDecorator={<Edit fontSize="small" />}
        onClick={(e) => {
          setShowDropdown(!showDropdown)
          setAnchorEl(e.currentTarget)
        }}
      >
        {toOpString(selectedOperator)}
      </Chip>
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
              forcePopupIcon={false}
              placeholder="Search operator"
              noOptionsText="No matching operator"
              options={opMenuItems}
              value={[
                {
                  id: selectedOperator,
                  label: toOpString(selectedOperator),
                },
              ]}
              onClose={(e, reason) => {
                if (reason === 'escape') {
                  handleClose()
                }
              }}
              renderTags={() => null}
              onChange={(event, newValue, reason) => {
                if (
                  event.type === 'keydown' &&
                  ((event as React.KeyboardEvent).key === 'Backspace' ||
                    (event as React.KeyboardEvent).key === 'Delete') &&
                  reason === 'removeOption'
                ) {
                  return
                }
                setShowDropdown(false)
                onChange((newValue[newValue.length - 1] as unknown as any).id)
              }}
              sx={{
                width: 180,
              }}
            />
          </Sheet>
        </ClickAwayListener>
      </Popper>
    </>
  )
}

function toOpString(op: OperatorType): string {
  return OperatorType[op].toLowerCase().replace(/_/g, ' ')
}
