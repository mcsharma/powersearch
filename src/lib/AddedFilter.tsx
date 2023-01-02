import { OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import RemoveFilterButton from "./RemoveFilterButton";
import Selector from "./components/Selector";
import { MenuItem } from "./components/DropdownMenu";
import FieldOperatorMappings from "./config/FieldOperatorMappings";
import OperatorSelector from "./OperatorSelector";
import FilterValuesInput from "./FilterValuesInput";
import Button from "./components/Button";

interface IFilterToken {
  filter: SimpleFilter<any>;
  onUpdate: (newFilter: SimpleFilter<any>) => void;
  onDelete: () => void;
}
const Root = window.styled.div`
  display: flex;
  align-items: stretch;
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

const AddedFilter: React.FC<IFilterToken> = ({
  filter,
  onDelete,
  onUpdate,
}) => {
  const valuesLabel = valuesList(filter.values);
  const [isEditing, setIsEditing] = React.useState(false);
  return (
    <Root>
      <Token round="left" label={filter.field.name} key="field" />
      <div style={{ width: 1 }} />
      <OperatorSelector
        fieldType={filter.field.type}
        selectedOperator={filter.operator}
        onChange={(op) => onUpdate({ ...filter, operator: op })}
      />
      <div style={{ width: 1 }} />
      {isEditing ? (
        <FilterValuesInput
          fieldType={filter.field.type}
          operatorType={filter.operator}
          values={filter.values}
          onUpdate={(values) => onUpdate({ ...filter, values })}
          onDone={(values) => {
            onUpdate({ ...filter, values });
            setIsEditing(false);
          }}
        />
      ) : (
        <Button
          label={valuesLabel}
          onClick={() => setIsEditing(true)}
          round="none"
        />
      )}
      <div style={{ width: 1 }} />
      <RemoveFilterButton onClick={onDelete} />
    </Root>
  );
};

export default AddedFilter;

const valuesList = (values: Array<any>): string => {
  if (values.length < 3) {
    return values.join(", ");
  }
  return `${values[0]} and ${values.length - 1} other values`;
};
