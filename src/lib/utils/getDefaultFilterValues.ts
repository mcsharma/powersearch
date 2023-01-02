import { FieldType, OperatorType } from "../types";

export default function getDefaultFilterValues(
  fieldType: FieldType,
  operatorType: OperatorType
): Array<any> {
  // TODO fully complete this
  switch (fieldType) {
    case FieldType.BOOLEAN:
      return [true];
  }
  return [""];
}
