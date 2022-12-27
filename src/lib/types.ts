export enum FieldType {
  BOOLEAN,
  INTEGER,
  FLOAT,
  STRING_ENUM,
  TEXT,
  DATE,
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
  CONTAINS,
  NOT_CONTAINS,
  STARTS_WITH,
  NOT_STARTS_WITH,
  ENDS_WITH,
  NOT_ENDS_WITH,
  IS_ANY_OF,
  IS_NONE_OF,
  CONTAINS_ANY_OF,
  CONTAINS_ALL_OF,
  CONTAINS_NONE_OF,
  IS_BEFORE,
  IS_AFTER,
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

interface ScalarField<T> extends FieldBase {
  value: T;
}

export interface NumericField extends ScalarField<number> {}
export interface BooleanField extends ScalarField<boolean> {}
export interface StringEnumField<T> extends ScalarField<T> {}
export interface TextField extends ScalarField<string> {}
export interface DateField extends ScalarField<Date> {}

export interface ArrayField<T> extends FieldBase {
  values: Array<T>;
}

export type Field<T> = ScalarField<T> | ArrayField<T>;

export type FieldsSchema = { [fieldName: string]: FieldBase };

export interface SimpleFilter<T> {
  id: string;
  field: FieldBase;
  operator: OperatorType;
  values: Array<T>;
}
