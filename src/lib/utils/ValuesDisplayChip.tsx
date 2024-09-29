import Edit from '@mui/icons-material/Edit'
import Chip from '@mui/joy/Chip'
import valuesList from './valuesList'
import React = require('react')
import { DefaultColorPalette } from '@mui/joy/styles/types/colorSystem'
import { EntityNames, SelectionType } from './types'

interface Props {
  entityNames: EntityNames
  selectionType: SelectionType
  values: string[]
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  rootRef?: React.Ref<HTMLDivElement>
  color?: DefaultColorPalette
}
export default function ValuesDisplayChip({
  entityNames,
  selectionType,
  values,
  onClick,
  rootRef,
  color,
}: Props) {
  return (
    <Chip
      color={color}
      sx={{ borderRadius: 0 }}
      endDecorator={<Edit fontSize="small" />}
      onClick={onClick}
      slotProps={rootRef ? { root: { ref: rootRef } } : undefined}
    >
      {valuesList(values, entityNames, selectionType)}
    </Chip>
  )
}
