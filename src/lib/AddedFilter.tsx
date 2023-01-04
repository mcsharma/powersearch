import { SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import RemoveFilterButton from "./RemoveFilterButton";
import OperatorSelector from "./OperatorSelector";
import FilterValuesInput from "./FilterValuesInput";
import Button from "./components/Button";
import valuesList from "./utils/valuesList";

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
          field={filter.field}
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
