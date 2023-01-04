import * as React from "react";
import { getRandomString } from "../utils/random";
import { TOKEN_COLOR } from "../utils/constants";

export interface MenuItem {
  label: string;
  key: string | number;
}
export type MenuItemKey = string | number;

export interface IDropdownMenuBase {
  id: string;
  label: string;
  items: Array<MenuItem>;
  activeItemKey?: MenuItemKey | null;
  onItemClick: (item: MenuItem) => void;
  itemRenderer?: (item: MenuItem) => React.ReactNode;
}

export default function DropdownMenuBase({
  id,
  label,
  items,
  activeItemKey,
  onItemClick,
  itemRenderer,
}: IDropdownMenuBase) {
  const itemsWithIDs = React.useMemo(() => {
    return items.map((item) => ({ ...item, __id: getRandomString() }));
  }, [items]);

  return (
    <Root
      role="listbox"
      id={id}
      aria-activedescendant={
        itemsWithIDs.find((item) => item.key === activeItemKey)?.__id
      }
      aria-label={label}
    >
      {itemsWithIDs.map((item, index) => {
        return (
          <ResultItem
            key={item.key}
            // Using mousedown instead of onClick because typeahead input's blur is called
            // before this item onClick and hiding this menu before onClick is executed.
            onMouseDown={() => onItemClick(item)}
            role="option"
            id={item.__id}
            isSelected={activeItemKey === item.key}
            aria-selected={activeItemKey === item.key}
          >
            {itemRenderer ? (
              itemRenderer(item)
            ) : (
              <ResultItemDefaultRenderer>
                {item.label}
              </ResultItemDefaultRenderer>
            )}
          </ResultItem>
        );
      })}
    </Root>
  );
}

const Root = window.styled.ul`
  box-sizing: border-box;
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 240px;
  border-radius: 2px 2px 6px 6px;
`;

const ResultItem = window.styled.li.attrs(
  ({ isSelected }: { isSelected: boolean }) => ({ isSelected })
)`
  box-sizing: border-box;
  display: flex;
  height: 32px;
  align-items: center;
  background-color: ${({ isSelected }) => {
    return isSelected ? TOKEN_COLOR : "white";
  }};
  :hover {
    background-color: ${TOKEN_COLOR};
  }
  &:first-child {
    border-radius: 2px 2px 0 0;
  }
  &:last-child {
    border-radius: 0 0 6px 6px;
  }
  cursor: pointer;
`;

const ResultItemDefaultRenderer = window.styled.div`
  padding-left: 12px; 
`;
