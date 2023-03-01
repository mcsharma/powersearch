import { FieldType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import RemoveFilterButton from "./RemoveFilterButton";
import OperatorSelector from "./OperatorSelector";
import FilterValuesInput from "./FilterValuesInput";
import Button from "./components/Button";
import valuesList from "./utils/valuesList";
import getInputType from "./utils/getInputType";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ICON_COLOR } from "./utils/constants";

interface IFilterToken {
  filter: SimpleFilter<any>;
  onUpdate: (newFilter: SimpleFilter<any>) => void;
  onDelete: () => void;
}

const AddedFilter: React.FC<IFilterToken> = ({
  filter,
  onDelete,
  onUpdate,
}) => {
  const valuesLabel = valuesList(filter.values);
  const [isEditing, setIsEditing] = React.useState(false);
  const inputType = getInputType(filter.field.type, filter.operator);
  return (
    <Root>
      <Token round="left" label={filter.field.name} key="field" />
      <div style={{ width: 1 }} />
      <OperatorSelector
        fieldType={filter.field.type}
        selectedOperator={filter.operator}
        onChange={(op) => onUpdate({ ...filter, operator: op })}
      />
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
        <>
          <div style={{ width: 1 }} />
          <Button
            iconRight={
              inputType === "enum" ? (
                <ArrowDropDownIcon sx={{ ml: "4px" }} htmlColor={ICON_COLOR} />
              ) : (
                <EditIcon
                  sx={{ ml: "8px", fontSize: "15px" }}
                  htmlColor={ICON_COLOR}
                />
              )
            }
            label={valuesLabel}
            onClick={() => setIsEditing(true)}
            round="none"
          />
          <div style={{ width: 1 }} />
        </>
      )}
      <RemoveFilterButton onClick={onDelete} />
    </Root>
  );
};

export default AddedFilter;

const Root = window.styled.div`
  display: flex;
  margin: 2px;
`;
