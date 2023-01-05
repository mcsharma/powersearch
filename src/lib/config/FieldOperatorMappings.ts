import { FieldType, OperatorType } from "../types";

const FieldOperatorMappings: { [key in FieldType]: Array<OperatorType> } = {
  [FieldType.BOOLEAN]: [OperatorType.IS],
  [FieldType.INTEGER]: [
    OperatorType.IS,
    OperatorType.IS_NOT,
    OperatorType.IS_LESS_THAN,
    OperatorType.IS_LESS_THAN,
    OperatorType.IS_LESS_THAN_OR_EQUAL,
    OperatorType.IS_GREATER_THAN,
    OperatorType.IS_GREATER_THAN_OR_EQUAL,
    OperatorType.IS_BETWEEN,
  ],
  [FieldType.FLOAT]: [
    OperatorType.IS,
    OperatorType.IS_NOT,
    OperatorType.IS_LESS_THAN,
    OperatorType.IS_LESS_THAN_OR_EQUAL,
    OperatorType.IS_GREATER_THAN,
    OperatorType.IS_GREATER_THAN_OR_EQUAL,
    OperatorType.IS_BETWEEN,
  ],
  [FieldType.STRING_ENUM]: [
    OperatorType.IS,
    OperatorType.IS_NOT,
    OperatorType.CONTAINS,
    OperatorType.NOT_CONTAINS,
    OperatorType.STARTS_WITH,
    OperatorType.NOT_STARTS_WITH,
    OperatorType.ENDS_WITH,
    OperatorType.NOT_ENDS_WITH,
  ],
  [FieldType.TEXT]: [
    OperatorType.IS,
    OperatorType.IS_NOT,
    OperatorType.CONTAINS,
    OperatorType.NOT_CONTAINS,
    OperatorType.STARTS_WITH,
    OperatorType.NOT_STARTS_WITH,
    OperatorType.ENDS_WITH,
    OperatorType.NOT_ENDS_WITH,
  ],
  [FieldType.DATE]: [
    OperatorType.IS,
    OperatorType.IS_NOT,
    OperatorType.IS_LESS_THAN,
    OperatorType.IS_LESS_THAN_OR_EQUAL,
    OperatorType.IS_GREATER_THAN,
    OperatorType.IS_GREATER_THAN_OR_EQUAL,
    OperatorType.IS_BETWEEN,
  ],
  [FieldType.DATE_AND_TIME]: [
    OperatorType.IS_LESS_THAN,
    OperatorType.IS_LESS_THAN_OR_EQUAL,
    OperatorType.IS_GREATER_THAN,
    OperatorType.IS_GREATER_THAN_OR_EQUAL,
    OperatorType.IS_BETWEEN,
  ],

  [FieldType.ARRAY]: [
    OperatorType.CONTAINS,
    OperatorType.CONTAINS_ANY_OF,
    OperatorType.CONTAINS_ALL_OF,
  ],
  // Not supported yet, added to satisfy TypeScript
  [FieldType.COMPOSITE]: [],
};

export default FieldOperatorMappings;
