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
          return (
            <>
              <TextFilterInput
                width={80}
                label="min value"
                inputType="integer"
                value={values[0]}
                onChange={(value) => onUpdate([value, values[1]])}
                onDone={(value) => onDone([value, values[1]])}
              />
              <TextFilterInput
                width={80}
                label="max value"
                inputType="integer"
                value={values[1]}
                onChange={(value) => onUpdate([values[0], value])}
                onDone={(value) => onDone([values[0], value])}
              />
            </>
          );

        default:
          return (
            <TextFilterInput
              label={field.name}
              inputType="integer"
              value={values[0]}
              onChange={(value) => onUpdate([value])}
              onDone={(value) => onDone([value])}
            />
          );
      }
    }
    case FieldType.FLOAT: {
      switch (operatorType) {
        case OperatorType.IS_BETWEEN:
          return (
            <>
              <TextFilterInput
                key="min"
                width={80}
                label="min value"
                inputType="float"
                value={values[0]}
                onChange={(value) => onUpdate([value, values[1]])}
                onDone={(value) => onDone([value, values[1]])}
              />
              <TextFilterInput
                key="max"
                width={80}
                label="max value"
                inputType="float"
                value={values[1]}
                onChange={(value) => onUpdate([values[0], value])}
                onDone={(value) => onDone([values[0], value])}
              />
            </>
          );
        default:
          return (
            <TextFilterInput
              label={field.name}
              inputType="float"
              value={values[0]}
              onChange={(value) => onUpdate([value])}
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
              label={field.name}
              value={values[0]}
              onChange={(value) => onUpdate([value])}
              onDone={(value) => onDone([value])}
            />
          );
      }
    }
    case FieldType.TEXT:
      return (
        <TextFilterInput
          label={field.name}
          inputType="text"
          value={values[0]}
          onChange={(value) => onUpdate([value])}
          onDone={(value) => onDone([value])}
        />
      );
    case FieldType.DATE: {
      console.log(operatorType);
      if (operatorType === OperatorType.IS_BETWEEN) {
        return (
          <>
            <DateInput
              key="min"
              label="from date"
              value={values[0]}
              onChange={(value) => onUpdate([value])}
            />
            <DateInput
              key="max"
              label="to date"
              value={values[0]}
              onChange={(value) => onUpdate([value])}
            />
          </>
        );
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
