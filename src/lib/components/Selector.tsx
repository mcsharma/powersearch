import * as React from "react";
import { getRandomString } from "../utils/random";
import DropdownMenu, { MenuItem } from "./DropdownMenu";
import * as ReactDOM from "react-dom";

interface ISelector {
  label: string;
  placeholder?: string;
  items: Array<MenuItem>;
  selectedItem: MenuItem | null;
  onSelect: (item: MenuItem) => void;
}

export default function Selector({
  label,
  placeholder,
  items,
  selectedItem,
  onSelect,
}: ISelector) {
  const dropdownID = React.useMemo(() => getRandomString(), []);
  const [menuShown, setMenuShown] = React.useState(false);
  const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(
    null
  );

  const onItemClick = (item: MenuItem) => {
    onSelect(item);
    setMenuShown(false);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "Enter":
        if (menuShown && activeItemIndex !== null) {
          onSelect(items[activeItemIndex]);
        }
        return;
      case "ArrowDown":
      case "Down":
        if (items.length == 0) {
          return;
        }
        if (activeItemIndex === null) {
          return setActiveItemIndex(0);
        }
        return setActiveItemIndex(
          Math.min(activeItemIndex + 1, items.length - 1)
        );
      case "ArrowUp":
      case "Up":
        if (items.length == 0) {
          return;
        }
        if (activeItemIndex === null) {
          return setActiveItemIndex(items.length - 1);
        }
        if (activeItemIndex === 0) {
          return setActiveItemIndex(null);
        }
        return setActiveItemIndex(activeItemIndex - 1);
      case "Esc":
      case "Escape":
        return setMenuShown(false);
    }
  };

  const buttonLabel = selectedItem === null ? placeholder : selectedItem.label;
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const buttonClientRect = buttonRef.current?.getBoundingClientRect();
  const { left: buttonPosLeft, bottom: buttonPosBottom } =
    buttonClientRect ?? {};

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setMenuShown(!menuShown)}
        aria-label={buttonLabel}
        onKeyDown={onKeyDown}
        aria-owns={dropdownID}
      >
        {buttonLabel}
      </button>
      {ReactDOM.createPortal(
        <DropdownMenu
          left={buttonPosLeft ?? 0}
          top={(buttonPosBottom ?? 0) + 5}
          id={dropdownID}
          shown={menuShown}
          label={label}
          items={items}
          onItemClick={onItemClick}
          activeItemIndex={activeItemIndex}
        />,
        document.body
      )}
    </>
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
  box-sizing: border-box;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0  5px 10px rgba(154,160,185,0.05), 0 15px 40px rgba(166,173,201,0.2);
  min-width: 240px;
  background-color: white;
  border-radius: 2px 2px 6px 6px;
`;
