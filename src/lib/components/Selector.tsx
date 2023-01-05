import * as React from "react";
import { getRandomString } from "../utils/random";
import Button from "./Button";
import useForceRenderAfterMount from "../utils/useForceRenderAfterMount";
import { MenuItem } from "./DropdownMenuBase";
import DropdownMenuWithSearch from "./DropdownMenuWithSearch";
import DropdownMenuWithoutSearch from "./DropdownMenuWithoutSearch";

interface ISelector {
  label: string;
  placeholder: string;
  items: Array<MenuItem>;
  selectedItem: MenuItem | null;
  onSelect: (item: MenuItem) => void;
  // Optional Props *********
  withSearch?: boolean;
  expandOnMount?: boolean;
}

export default function Selector({
  label,
  placeholder,
  items,
  selectedItem,
  onSelect,
  withSearch,
  expandOnMount,
}: ISelector) {
  const dropdownID = React.useMemo(() => getRandomString(), []);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [menuShown, setMenuShown] = React.useState(expandOnMount ?? false);
  // Used only for search based use case
  const [focusMode, setFocusMode] = React.useState<"input" | "dropdown">(
    "input"
  );
  const selectedItemIndex = items.findIndex(
    (item) => item.key === selectedItem?.key
  );
  // Used only for non-search based use case.
  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(-1);

  function closeMenu() {
    setMenuShown(false);
    if (withSearch) {
      setFocusMode("input");
    } else {
      setActiveItemIndex(-1);
    }
  }
  function openMenu() {
    setMenuShown(true);
  }
  const onItemClick = (item: MenuItem) => {
    onSelect(item);
    closeMenu();
  };

  React.useEffect(() => {
    if (withSearch && focusMode === "input") {
      if (menuShown) {
        buttonRef.current?.focus();
      }
    }
  }, [focusMode]);

  const onClick = () => {
    if (!menuShown) {
      openMenu();
      return;
    }
    if (!withSearch) {
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
        if (withSearch) {
          setFocusMode("dropdown");
        } else {
          if (items.length === 0) {
            return;
          }
          if (activeItemIndex === -1 && selectedItemIndex !== -1) {
            setActiveItemIndex(selectedItemIndex);
          } else {
            setActiveItemIndex((activeItemIndex + 1) % items.length);
          }
        }
        return;
      case "ArrowUp":
      case "Up":
        if (!menuShown) {
          return;
        }
        if (!withSearch && items.length > 0) {
          if (activeItemIndex === -1) {
            setActiveItemIndex(items.length - 1);
          } else {
            setActiveItemIndex(
              (activeItemIndex - 1 + items.length) % items.length
            );
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
      {withSearch ? (
        <DropdownMenuWithSearch
          id={dropdownID}
          shown={menuShown}
          top={(buttonPosBottom ?? 0) + 5}
          left={buttonPosLeft ?? 0}
          label={label}
          items={items}
          onItemClick={onItemClick}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          selectedItemKey={selectedItem?.key ?? null}
        />
      ) : (
        <DropdownMenuWithoutSearch
          shown={menuShown}
          id={dropdownID}
          top={(buttonPosBottom ?? 0) + 5}
          left={buttonPosLeft ?? 0}
          label={label}
          items={items}
          onItemClick={onItemClick}
          activeItemKey={
            activeItemIndex === null
              ? null
              : items[activeItemIndex]?.key ?? null
          }
          selectedItemKey={selectedItem?.key ?? null}
        />
      )}
    </>
  );
}
