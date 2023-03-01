import { FieldBase, FieldType, OperatorType } from "./types";
import * as React from "react";
import BooleanValueSelector from "./BooleanValueSelector";
import StringEnumValuesSelector from "./StringEnumValuesSelector";
import TextField from "@mui/material/TextField";
import USAStates from "../app/USAStates";
import TextFilterInput from "./TextFilterInput";
import DateInput from "./components/DateInput";

interface IFilterValuesInput {
  field: FieldBase;
  operatorType: OperatorType;
  values: Array<any>;
  onUpdate: (values: Array<any>) => void;
  onDone: (values: Array<any>) => void;
}

export default function FilterValuesInput({
  field,
  values,
  onUpdate,
  onDone,
  operatorType,
}: IFilterValuesInput) {
  const [value, setValue] = React.useState<string | null>(null);
  switch (field.type) {
    case FieldType.BOOLEAN: {
      return (
        <BooleanValueSelector
          selectedValue={values[0]}
          onSelect={(val) => {
            onDone([val]);
          }}
        />
      );
    }
    case FieldType.INTEGER: {
      switch (operatorType) {
        case OperatorType.IS_BETWEEN:
          throw new Error("unimplemented!");
        default:
          return (
            <TextFilterInput
              inputType="integer"
              value={values[0]}
              onUpdate={(value) => onUpdate([value])}
              onDone={(value) => onDone([value])}
            />
          );
      }
    }
    case FieldType.FLOAT: {
      switch (operatorType) {
        case OperatorType.IS_BETWEEN:
          throw new Error("unimplemented!");
        default:
          return (
            <TextFilterInput
              inputType="float"
              value={values[0]}
              onUpdate={(value) => onUpdate([value])}
              onDone={(value) => onDone([value])}
            />
          );
      }
    }
    case FieldType.STRING_ENUM: {
      switch (operatorType) {
        case OperatorType.IS:
        case OperatorType.IS_NOT:
          return (
            <StringEnumValuesSelector
              label={`Select ${field.name}`}
              values={values}
              onUpdate={onUpdate}
              onDone={onDone}
              strEnum={USAStates}
            />
          );
        default:
          return (
            <TextFilterInput
              inputType="text"
              value={values[0]}
              onUpdate={(value) => onUpdate([value])}
              onDone={(value) => onDone([value])}
            />
          );
      }
    }
    case FieldType.TEXT:
      return (
        <TextFilterInput
          inputType="text"
          value={values[0]}
          onUpdate={(value) => onUpdate([value])}
          onDone={(value) => onDone([value])}
        />
      );
    case FieldType.DATE: {
      console.log(operatorType);
      if (operatorType === OperatorType.IS_BETWEEN) {
        throw new Error("unimplemented!");
      } else {
        return (
          <DateInput
            label=""
            value={values[0]}
            onChange={(value) => onUpdate([value])}
          />
        );
      }
    }
    case FieldType.DATE_AND_TIME: {
      if (operatorType == OperatorType.IS_BETWEEN) {
        throw new Error("unimplemented!");
      } else {
        throw new Error("unimplemented!");
      }
    }
    case FieldType.ARRAY:
      throw new Error("unimplemented!");

    default:
      throw new Error("unimplemented!");
  }
}
