import * as React from "react";
import { getRandomString } from "../utils/random";
import { TOKEN_COLOR } from "../utils/constants";

export interface MenuItem {
  label: string;
  key: string | number;
}
interface IDrodownMenu {
  id: string;
  shown: boolean;
  label: string;
  left: number;
  top: number;
  items: Array<MenuItem>;
  onItemClick: (item: MenuItem) => void;
  activeItemIndex: number | null;
  itemRenderer?: (item: MenuItem) => React.ReactNode;
}

export default function DropdownMenu({
  id,
  shown,
  label,
  left,
  top,
  items,
  activeItemIndex,
  onItemClick,
  itemRenderer,
}: IDrodownMenu) {
  const itemsWithIDs = React.useMemo(() => {
    return items.map((item) => ({ ...item, __id: getRandomString() }));
  }, [items]);

  return (
    <Root
      shown={shown}
      role="listbox"
      id={id}
      left={left}
      top={top}
      aria-activedescendant={
        activeItemIndex !== null
          ? itemsWithIDs[activeItemIndex]?.__id
          : undefined
      }
      aria-label={label}
    >
      {itemsWithIDs.map((item, index) => {
        return (
          <ResultItem
            key={item.__id}
            // Using mousedown instead of onClick because typeahead input's blur is called
            // before this item onClick and hiding this menu before onClick is executed.
            onMouseDown={() => onItemClick(item)}
            role="option"
            id={item.__id}
            isSelected={index === activeItemIndex}
            aria-selected={index === activeItemIndex}
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

interface RootProps {
  left: number;
  top: number;
  shown: boolean;
}
const Root = window.styled.ul.attrs(({ left, top, shown }: RootProps) => ({
  left,
  top,
  shown,
}))`
  display: ${({ shown }) => {
    return shown ? undefined : "none";
  }};
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  box-sizing: border-box;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0  5px 10px rgba(154,160,185,0.05), 0 15px 40px rgba(166,173,201,0.2);
  min-width: 240px;
  background-color: white;
  border-radius: 2px 2px 6px 6px;
  position: absolute;
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
    background: ${TOKEN_COLOR};
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
