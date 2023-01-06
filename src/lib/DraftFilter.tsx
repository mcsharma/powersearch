import { SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import FilterValuesInput from "./FilterValuesInput";
import { getRandomString } from "./utils/random";
import RemoveFilterButton from "./RemoveFilterButton";
import OperatorSelector from "./OperatorSelector";

const Root = window.styled.div`
  display: flex;
  &:not(:last-child) {
    margin-right: 4px;
  }
`;

interface IActiveFilter {
  filter: SimpleFilter<any>;
  onUpdate: (newFilter: SimpleFilter<any>) => void;
  onDone: (filter: SimpleFilter<any>) => void;
  onRemove: () => void;
}

const DraftFilter: React.FC<IActiveFilter> = ({
  filter,
  onUpdate,
  onDone,
  onRemove,
}) => {
  const onInputDone = (values: Array<any>) => {
    onDone({
      ...filter,
      values,
      id: getRandomString(),
    });
  };

  return (
    <Root>
      <Token round="left" label={filter.field.name} />
      <div style={{ width: 1 }} />
      <OperatorSelector
        fieldType={filter.field.type}
        selectedOperator={filter.operator}
        onChange={(operator) => onUpdate({ ...filter, operator })}
      />
      <FilterValuesInput
        field={filter.field}
        operatorType={filter.operator}
        values={filter.values}
        onUpdate={(values) => onUpdate({ ...filter, values })}
        onDone={onInputDone}
      />
      <RemoveFilterButton onClick={onRemove} />
    </Root>
  );
};

export default DraftFilter;
