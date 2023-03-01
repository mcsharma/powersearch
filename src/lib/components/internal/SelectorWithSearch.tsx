import * as React from "react";
import * as ReactDOM from "react-dom";
import { getRandomString } from "../../utils/random";
import useForceRenderAfterMount from "../../utils/useForceRenderAfterMount";
import DropdownMenuBase, { MenuItem } from "../DropdownMenuBase";
import valuesList from "../../utils/valuesList";
import { ISelector } from "../Selector";
import Token from "../../Token";
import Button from "../Button";
import { ICON_COLOR, TOKEN_HEIGHT } from "../../utils/constants";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function SelectorWithSearch<
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
      onDropdownCloseRef.current && onDropdownCloseRef.current();
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

  const onItemClick = (clickedItem: MenuItem, index: number) => {
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
    setActiveItemIndex(index);
  };

  React.useEffect(() => {
    if (expandOnMount) {
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

  // #### Following logic is specific to SelectorWithSearch.tsx #######
  const searchInputID = React.useMemo(() => getRandomString(), []);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState("");
  const [searchResults, setSearchResults] =
    React.useState<Array<MenuItem>>(items);

  const onQueryChange = (q: string) => {
    setQuery(q);
    const newResults = items.filter((item) =>
      item.label.toLowerCase().includes(q.trim().toLowerCase())
    );
    setSearchResults(newResults);
    setActiveItemIndex(0);
  };

  const onButtonKeydown: React.KeyboardEventHandler = (e) => {
    switch (e.key) {
      case "Enter":
        // Pressing enter triggers onClick, no need to handle it here.
        return;
      case "ArrowDown":
      case "Down":
        openMenu();
        return;
      case "ArrowUp":
      case "Up":
      case "Esc":
      case "Escape":
        closeMenu();
        return;
    }
  };

  const onSearchKeyDown = (key: string) => {
    switch (key) {
      case "Enter":
        if (searchResults[activeItemIndex]) {
          onItemClick(searchResults[activeItemIndex], activeItemIndex);
        } else {
          closeMenu();
        }
        return;
      case "ArrowDown":
      case "Down":
        if (searchResults.length > 0) {
          const curIndex =
            activeItemIndex === -1 && !isMultiSelect
              ? singleSelectedItemIndex
              : activeItemIndex;
          setActiveItemIndex((curIndex + 1) % searchResults.length);
        }
        return;
      case "ArrowUp":
      case "Up":
        if (searchResults.length > 0) {
          const curIndex =
            activeItemIndex === -1 && !isMultiSelect
              ? singleSelectedItemIndex
              : activeItemIndex;
          if (curIndex === -1) {
            setActiveItemIndex(searchResults.length - 1);
          } else {
            setActiveItemIndex(
              (curIndex - 1 + searchResults.length) % searchResults.length
            );
          }
        }
        return;
      case "Esc":
      case "Escape":
        closeMenu();
        return;
    }
  };

  React.useEffect(() => {
    if (menuShown) {
      searchInputRef?.current?.focus();
    } else {
      buttonRef.current?.focus();
      setActiveItemIndex(-1);
    }
  }, [menuShown]);

  return (
    <>
      <Button
        iconRight={
          <ArrowDropDownIcon sx={{ ml: "4px" }} htmlColor={ICON_COLOR} />
        }
        buttonRef={buttonRef as React.RefObject<HTMLButtonElement>}
        onClick={() => (menuShown ? closeMenu() : openMenu())}
        label={buttonLabel}
        onKeyDown={onButtonKeydown}
        ownedIDs={[dropdownID]}
        round="none"
      />
      {ReactDOM.createPortal(
        <DropdownWrapper
          ref={dropdownRootRef}
          shown={menuShown}
          top={(buttonPosBottom ?? 0) + 5}
          left={buttonPosLeft ?? 0}
        >
          <SearchInput
            ref={searchInputRef}
            id={searchInputID}
            placeholder="Search..."
            aria-label="Search dropdown items"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => onSearchKeyDown(e.key)}
          />
          <DropdownMenuBase
            items={searchResults}
            activeItemKey={searchResults[activeItemIndex]?.key ?? null}
            onItemClick={onItemClick}
            id={dropdownID}
            label={label}
            selectedItemKeys={
              isMultiSelect
                ? selection.map((item) => item.key)
                : selection
                ? [selection.key]
                : []
            }
          />
        </DropdownWrapper>,
        document.body
      )}
    </>
  );
}

interface DropdownWrapperProps {
  left: number;
  top: number;
  shown: boolean;
}
const DropdownWrapper = window.styled.div.attrs(
  ({ left, top, shown }: DropdownWrapperProps) => ({
    left,
    top,
    shown,
  })
)`
  display: ${({ shown }) => {
    return shown ? "flex" : "none";
  }};
  flex-direction: column;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  position: absolute;
  box-shadow: 0  5px 10px rgba(154,160,185,0.05), 0 15px 40px rgba(166,173,201,0.2);
`;
const SearchInput = window.styled.input`
  box-sizing: border-box;
  margin-bottom: 1px;
  padding-left: 12px;
  width: 100%;
  height: ${TOKEN_HEIGHT}px;
  border: 1px solid lightgrey;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid lightgrey;
`;
