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
  selectedItemKey: MenuItemKey | null;
  onItemClick: (item: MenuItem) => void;
  itemRenderer?: (item: MenuItem) => React.ReactNode;
}

export default function DropdownMenuBase({
  id,
  label,
  items,
  activeItemKey,
  selectedItemKey,
  onItemClick,
  itemRenderer,
}: IDropdownMenuBase) {
  const itemsWithIDs = React.useMemo(() => {
    return items.map((item) => ({ ...item, __id: getRandomString() }));
  }, [items]);

  const activeItem =
    itemsWithIDs.find((item) => item.key === activeItemKey) ?? null;
  const selectedItem =
    itemsWithIDs.find((item) => item.key === selectedItemKey) ?? null;

  return (
    <Root
      role="listbox"
      id={id}
      aria-activedescendant={
        selectedItem === null ? undefined : selectedItem.__id
      }
      aria-label={label}
    >
      {itemsWithIDs.map((item) => {
        const isActive = item.key === activeItemKey;
        const isSelected = item.key === selectedItemKey;
        return (
          <ResultItem
            key={item.key}
            onClick={() => onItemClick(item)}
            role="option"
            id={item.__id}
            isActive={isActive}
            aria-selected={isActive}
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