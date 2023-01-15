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
  // item that's currently active, which is what
  // get selected if user press enter
  activeItemKey: MenuItemKey | null;
  // Item that's currenly chosen
  selectedItemKeys: Array<MenuItemKey>;
  onItemClick: (item: MenuItem, index: number) => void;
  // Optional props
  multiple?: boolean;
  itemRenderer?: (item: MenuItem) => React.ReactNode;
}

export default function DropdownMenuBase({
  id,
  label,
  items,
  activeItemKey,
  selectedItemKeys,
  onItemClick,
  multiple,
  itemRenderer,
}: IDropdownMenuBase) {
  return (
    <Root
      role="listbox"
      id={id}
      aria-multiselectable={multiple ?? false}
      aria-activedescendant={activeItemKey ? `${id}-${activeItemKey}` : ""}
      aria-label={label}
    >
      {items.map((item, index) => {
        const isActive = item.key === activeItemKey;
        const isSelected = selectedItemKeys.includes(item.key);
        return (
          <ResultItem
            key={item.key}
            onClick={() => onItemClick(item, index)}
            role="option"
            id={`${id}-${item.key}`}
            isActive={isActive}
            aria-selected={isSelected}
          >
            {itemRenderer ? (
              itemRenderer(item)
            ) : (
              <ResultItemDefaultRenderer>
                <IconWrapper>
                  {isSelected ? (
                    <img src="assets/check.svg" alt="checkmark" />
                  ) : null}
                </IconWrapper>
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
  max-height: 300px;
  overflow: auto;
`;

const ResultItem = window.styled.li.attrs(
  ({ isActive }: { isActive: boolean }) => ({ isActive })
)`
  box-sizing: border-box;
  display: flex;
  height: 32px;
  align-items: center;
  background-color: ${({ isActive }) => {
    return isActive ? TOKEN_COLOR : "white";
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
  display: flex;
`;

const IconWrapper = window.styled.div`
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;