import { FieldType, OperatorType } from "../types";

export default function getInputType(
  fieldType: FieldType,
  op: OperatorType
): "enum" | "text" {
  if (
    fieldType === FieldType.STRING_ENUM &&
    (op === OperatorType.IS || op === OperatorType.IS_NOT)
  ) {
    return "enum";
  }
  return "text";
}
