import { FieldBase, OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import FilterValuesInput from "./FilterValuesInput";
import { getRandomString } from "./utils/random";
import RemoveFilterButton from "./RemoveFilterButton";
import Selector from "./components/Selector";
import FieldOperatorMappings from "./config/FieldOperatorMappings";
import { MenuItem } from "./components/DropdownMenu";
import getDefaultFilterValues from "./utils/getDefaultFilterValues";

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
  const opMenuItems = React.useMemo(
    () =>
      FieldOperatorMappings[filter.field.type].map((op) => ({
        key: op,
        label: OperatorType[op].toLowerCase().replace(/_/g, " "),
      })),
    []
  );
  // const [opItem, setOpItem] = React.useState<MenuItem>(
  //   opMenuItems.find((item) => item.key === draftFilter?.operator) ??
  //     opMenuItems[0]
  // );
  const onInputDone = (values: Array<any>) => {
    onDone({
      ...filter,
      values,
      id: getRandomString(),
    });
  };

  const selectedOpItem = React.useMemo(
    () => ({
      key: filter.operator,
      label: OperatorType[filter.operator].toLowerCase().replace(/_/g, " "),
    }),
    [filter.operator]
  );

  return (
    <Root>
      <Token round="left" label={filter.field.name} />
      <div style={{ width: 1 }} />
      <Selector
        label="Operator Selector"
        items={opMenuItems}
        selectedItem={selectedOpItem}
        onSelect={(item) =>
          onUpdate({ ...filter, operator: item.key as OperatorType })
        }
        placeholder="Select Operator"
      />
      <FilterValuesInput
        fieldType={filter.field.type}
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
