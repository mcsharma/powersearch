import * as React from "react";
import { getRandomString } from "../../utils/random";
import Button from "../Button";
import useForceRenderAfterMount from "../../utils/useForceRenderAfterMount";
import { MenuItem } from "../DropdownMenuBase";
import DropdownMenu from "../DropdownMenu";
import valuesList from "../../utils/valuesList";
import { ISelector } from "../Selector";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ICON_COLOR } from "../../utils/constants";

type ElementAction = "click" | "enter" | "space";
// For single select T is MenuItem, for multi select, T is MenuItem[]
export default function SelectorWithoutSearch<
  T extends Array<MenuItem> | MenuItem
>({
  label,
  placeholder,
  items,
  selection,
  onSelectionChange,
  onDropdownOpen,
  onDropdownClose,
  expandOnMount,
}: Omit<ISelector<T>, "withSearch">) {
  const dropdownID = React.useMemo(() => getRandomString(), []);
  const dropdownRootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [menuShown, _setMenuShown] = React.useState<boolean>(false);
  // Using a refs as well so that we have access to the latest state inside event listener
  // https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state
  const menuShownRef = React.useRef<boolean>(false);
  const onDropdownOpenRef = React.useRef(onDropdownOpen);
  const onDropdownCloseRef = React.useRef(onDropdownClose);
  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(-1);
  const isMultiSelect = Array.isArray(selection);
  // Used only for single select use case
  const singleSelectedItemIndex = isMultiSelect
    ? -1
    : items.findIndex((item) => item.key === selection?.key);

  React.useEffect(() => {
    onDropdownCloseRef.current = onDropdownClose;
  }, [onDropdownClose]);
  React.useEffect(() => {
    onDropdownOpenRef.current = onDropdownOpen;
  }, [onDropdownOpen]);

  function openMenu() {
    if (!menuShownRef.current) {
      _setMenuShown(true);
      menuShownRef.current = true;
      onDropdownOpenRef.current && onDropdownOpenRef.current();
    }
  }
  function closeMenu() {
    if (menuShownRef.current) {
      _setMenuShown(false);
      menuShownRef.current = false;
      setTimeout(
        () => onDropdownCloseRef.current && onDropdownCloseRef.current(),
        0
      );
    }
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

  React.useEffect(() => {
    if (expandOnMount) {
      buttonRef.current?.focus();
      openMenu();
    }
    function globalClickHandler(event: MouseEvent) {
      if (dropdownRootRef.current) {
        if (
          !dropdownRootRef.current.contains(event.target as Node) &&
          event.target !== buttonRef.current
        ) {
          closeMenu();
        }
      }
    }
    // In next event loop, to avoid being called immediately
    // https://stackoverflow.com/questions/27625584/attaching-click-event-listener-in-onclick-immediately-calls-that-event-listener
    setTimeout(() => document.addEventListener("click", globalClickHandler), 0);
    return () => {
      document.removeEventListener("click", globalClickHandler);
    };
  }, []);

  React.useEffect(() => {
    if (expandOnMount) {
      buttonRef.current?.focus();
      openMenu();
    }
  }, []);

  const onButtonAction = (action: ElementAction) => {
    if (!menuShown) {
      return openMenu();
    }
    const activeItem = items[activeItemIndex];
    if (action === "click" || !activeItem) {
      return closeMenu();
    }
    onItemSelect(activeItem);
    if (!isMultiSelect || action === "enter") {
      closeMenu();
    }
  };
  const onItemClick = (item: MenuItem, index: number) => {
    onItemSelect(item);
    if (!isMultiSelect) {
      closeMenu();
    }
    setActiveItemIndex(index);
    buttonRef.current?.focus();
  };
  const onItemSelect = (selectedItem: MenuItem) => {
    if (isMultiSelect) {
      if (selection.find((item) => item.key === selectedItem.key)) {
        removeItem(selectedItem);
      } else {
        addItem(selectedItem);
      }
    } else {
      onSelectionChange(selectedItem as T);
    }
  };

  const onButtonKeydown: React.KeyboardEventHandler = (e) => {
    switch (e.key) {
      case " ":
        onButtonAction("space");
        // To prevent the enter or space key from triggering onClick again
        e.preventDefault();
        return;
      case "Enter":
        onButtonAction("enter");
        e.preventDefault();
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
          openMenu();
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
      : valuesList(selection.map((item) => item.label))
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
        iconRight={
          <ArrowDropDownIcon sx={{ ml: "4px" }} htmlColor={ICON_COLOR} />
        }
        buttonRef={buttonRef as React.RefObject<HTMLButtonElement>}
        onClick={() => onButtonAction("click")}
        label={buttonLabel}
        onKeyDown={onButtonKeydown}
        ownedIDs={[dropdownID]}
        round="none"
      />
      <DropdownMenu
        rootRef={dropdownRootRef}
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
        multiple={isMultiSelect}
      />
    </>
  );
}
