import * as React from "react";
import { getRandomString } from "../utils/random";
import DropdownMenu, { MenuItem } from "./DropdownMenu";
import * as ReactDOM from "react-dom";
import { TOKEN_COLOR } from "../utils/constants";
import Button from "./Button";

interface ISelector {
  label: string;
  placeholder: string;
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
      <Button
        buttonRef={buttonRef}
        onClick={() => setMenuShown(!menuShown)}
        label={buttonLabel}
        onKeyDown={onKeyDown}
        ownedIDs={[dropdownID]}
        round="none"
      />
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
const DropdownButton = window.styled.button`
  border: none;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${TOKEN_COLOR};
  flex-shrink: 0;
  font-family: verdana;
  font-size: 14px;
  cursor: pointer;
`;
