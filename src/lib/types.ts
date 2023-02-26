export enum FieldType {
  BOOLEAN,
  INTEGER,
  FLOAT,
  STRING_ENUM,
  TEXT,
  DATE,
  DATE_AND_TIME,
  ARRAY,
  COMPOSITE,
}

export enum OperatorType {
  IS,
  IS_NOT,
  IS_LESS_THAN,
  IS_LESS_THAN_OR_EQUAL,
  IS_GREATER_THAN,
  IS_GREATER_THAN_OR_EQUAL,
  IS_BETWEEN,
  CONTAINS,
  NOT_CONTAINS,
  STARTS_WITH,
  NOT_STARTS_WITH,
  ENDS_WITH,
  NOT_ENDS_WITH,
  CONTAINS_ANY_OF,
  CONTAINS_ALL_OF,
}

export enum FilterType {
  SIMPLE,
  COMPOSITE,
}

export enum ConjunctionType {
  ANY,
  ALL,
  NONE,
}

export interface FieldBase {
  type: FieldType;
  name: string;
  desc: string;
}

export interface ScalarField extends FieldBase {}
export interface StringEnumField extends FieldBase {
  strEnum: { [key: string]: string };
}
export interface ArrayField extends FieldBase {}

export type Field = ScalarField | StringEnumField | ArrayField;

export type FieldsSchema = {
  [fieldName: string]: Field;
};

export interface SimpleFilter<T> {
  id: string;
  field: FieldBase;
  operator: OperatorType;
  values: Array<T>;
}
