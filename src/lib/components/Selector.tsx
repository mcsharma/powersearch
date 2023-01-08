import * as React from "react";
import { getRandomString } from "../utils/random";
import Button from "./Button";
import useForceRenderAfterMount from "../utils/useForceRenderAfterMount";
import { MenuItem } from "./DropdownMenuBase";
import DropdownMenu from "./DropdownMenu";
import valuesList from "../utils/valuesList";

interface ISelector<T> {
  label: string;
  placeholder: string;
  items: Array<MenuItem>;
  selection: T | null;
  onSelectionChange: (selection: T) => void;
  // Optional Props *********
  multiple?: boolean;
  expandOnMount?: boolean;
}

// For single select T is MenuItem, for multi select, T is MenuItem[]
export default function Selector<T extends Array<MenuItem> | MenuItem>({
  label,
  placeholder,
  items,
  selection,
  onSelectionChange,
  expandOnMount,
}: ISelector<T>) {
  const dropdownID = React.useMemo(() => getRandomString(), []);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [menuShown, setMenuShown] = React.useState(false);
  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(-1);
  const isMultiSelect = Array.isArray(selection);

  // Used only for single select use case
  const singleSelectedItemIndex = isMultiSelect
    ? -1
    : items.findIndex((item) => item.key === selection?.key);

  function closeMenu() {
    setMenuShown(false);
    setActiveItemIndex(-1);
  }
  function openMenu() {
    setMenuShown(true);
  }

  // For multi-select use case
  function addItem(item: MenuItem) {
    onSelectionChange([...(selection as Array<MenuItem>), item] as T);
  }
  // For multi-select use case
  function removeItem(removedItem: MenuItem) {
    onSelectionChange(
      (selection as Array<MenuItem>)?.filter(
        (item) => item.key !== removedItem.key
      ) as T
    );
  }

  const onItemClick = (clickedItem: MenuItem) => {
    if (isMultiSelect) {
      if (selection.find((item) => item.key === clickedItem.key)) {
        removeItem(clickedItem);
      } else {
        addItem(clickedItem);
      }
    } else {
      onSelectionChange(clickedItem as T);
      closeMenu();
    }
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
            activeItemIndex === -1 && !isMultiSelect
              ? singleSelectedItemIndex
              : activeItemIndex;
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
            activeItemIndex === -1 && !isMultiSelect
              ? singleSelectedItemIndex
              : activeItemIndex;
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

  const buttonLabel = isMultiSelect
    ? selection.length === 0
      ? placeholder
      : valuesList(selection.map(item => item.label))
    : selection === null
    ? placeholder
    : selection.label;
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
        selectedItemKeys={
          isMultiSelect
            ? selection.map((item) => item.key)
            : selection
            ? [selection.key]
            : []
        }
      />
    </>
  );
}
