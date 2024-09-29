import { EntityNames, SelectionType } from './types'

export default function valuesList(
  values: Array<any>,
  entityNames: EntityNames,
  selectionType: SelectionType = 'multiple'
): string {
  if (values.length === 0) {
    return `select ${
      selectionType === 'single' ? entityNames.singular : entityNames.plural
    }`
  }
  if (values.length < 3) {
    return values.join(', ')
  }
  return `${values[0]} and ${values.length - 1} other ${entityNames.plural}`
}
