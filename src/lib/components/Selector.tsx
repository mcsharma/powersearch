import * as React from "react";
import { getRandomString } from "../utils/random";
import Button from "./Button";
import useForceRenderAfterMount from "../utils/useForceRenderAfterMount";
import { MenuItem } from "./DropdownMenuBase";
import DropdownMenu from "./DropdownMenu";

interface ISelector {
  label: string;
  placeholder: string;
  items: Array<MenuItem>;
  selectedItem: MenuItem | null;
  onSelect: (item: MenuItem) => void;
  // Optional Props *********
  expandOnMount?: boolean;
}

export default function Selector({
  label,
  placeholder,
  items,
  selectedItem,
  onSelect,
  expandOnMount,
}: ISelector) {
  const dropdownID = React.useMemo(() => getRandomString(), []);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [menuShown, setMenuShown] = React.useState(false);
  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(-1);
  const selectedItemIndex = items.findIndex(
    (item) => item.key === selectedItem?.key
  );

  function closeMenu() {
    setMenuShown(false);
    setActiveItemIndex(-1);
  }
  function openMenu() {
    setMenuShown(true);
  }
  const onItemClick = (item: MenuItem) => {
    onSelect(item);
    closeMenu();
  };

  React.useEffect(() => {
    if (expandOnMount) {
      buttonRef.current?.focus();
      openMenu();
    }
  }, []);

  const onClick = () => {
    if (!menuShown) {
      openMenu();
      return;
    }
    if (items[activeItemIndex]) {
      onItemClick(items[activeItemIndex]);
    } else {
      closeMenu();
    }
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "Enter":
        // Pressing enter triggers onClick, no need to handle it here.
        return;
      case "ArrowDown":
      case "Down":
        if (!menuShown) {
          openMenu();
          return;
        }
        if (items.length > 0) {
          const curIndex =
            activeItemIndex !== -1 ? activeItemIndex : selectedItemIndex;
          setActiveItemIndex((curIndex + 1) % items.length);
        }
        return;
      case "ArrowUp":
      case "Up":
        if (!menuShown) {
          return;
        }
        if (items.length > 0) {
          const curIndex =
            activeItemIndex !== -1 ? activeItemIndex : selectedItemIndex;
          if (curIndex === -1) {
            setActiveItemIndex(items.length - 1);
          } else {
            setActiveItemIndex((curIndex - 1 + items.length) % items.length);
          }
        }
        return;
      case "Esc":
      case "Escape":
        if (menuShown) {
          closeMenu();
        }
        return;
    }
  };

  const buttonLabel = selectedItem === null ? placeholder : selectedItem.label;
  const buttonClientRect = buttonRef.current?.getBoundingClientRect();
  const { left: buttonPosLeft, bottom: buttonPosBottom } =
    buttonClientRect ?? {};

  useForceRenderAfterMount();

  return (
    <>
      <Button
        buttonRef={buttonRef as React.RefObject<HTMLButtonElement>}
        onClick={onClick}
        label={buttonLabel}
        onKeyDown={onKeyDown}
        ownedIDs={[dropdownID]}
        round="none"
      />
      <DropdownMenu
        shown={menuShown}
        id={dropdownID}
        top={(buttonPosBottom ?? 0) + 5}
        left={buttonPosLeft ?? 0}
        label={label}
        items={items}
        onItemClick={onItemClick}
        activeItemKey={items[activeItemIndex]?.key ?? null}
        selectedItemKey={selectedItem?.key ?? null}
      />
    </>
  );
}
