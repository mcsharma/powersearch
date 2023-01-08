import * as React from "react";
import * as ReactDOM from "react-dom";
import { getRandomString } from "../utils/random";
import Button from "./Button";
import useForceRenderAfterMount from "../utils/useForceRenderAfterMount";
import DropdownMenuBase, { MenuItem } from "./DropdownMenuBase";
import valuesList from "../utils/valuesList";

interface ISelectorWithSearch<T> {
  label: string;
  placeholder: string;
  items: Array<MenuItem>;
  selection: T | null;
  onSelectionChange: (selection: T) => void;
  // Optional Props *********
  expandOnMount?: boolean;
}

export default function SelectorWithSearch<
  T extends Array<MenuItem> | MenuItem
>({
  label,
  placeholder,
  items,
  selection,
  onSelectionChange,
  expandOnMount,
}: ISelectorWithSearch<T>) {
  const [searchInputID, dropdownID] = React.useMemo(
    () => [getRandomString(), getRandomString()],
    []
  );
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [menuShown, setMenuShown] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [searchResults, setSearchResults] =
    React.useState<Array<MenuItem>>(items);
  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(-1);
  const isMultiSelect = Array.isArray(selection);

  // Used only for single select use case
  const singleSelectedItemIndex = isMultiSelect
    ? -1
    : items.findIndex((item) => item.key === selection?.key);

  const onQueryChange = (q: string) => {
    setQuery(q);
    const newResults = items.filter((item) =>
      item.label.toLowerCase().includes(q.trim().toLowerCase())
    );
    setSearchResults(newResults);
    setActiveItemIndex(0);
  };

  const onInputKeyDown = (key: string) => {
    switch (key) {
      case "Enter":
        // Pressing enter triggers onClick, no need to handle it here.
        return;
      case "ArrowDown":
      case "Down":
        if (!menuShown) {
          setMenuShown(true);
          return;
        }
        return;
      case "ArrowUp":
      case "Up":
      case "Esc":
      case "Escape":
        if (menuShown) {
          setMenuShown(false);
        }
        return;
    }
  };
  const onSearchKeyDown = (key: string) => {
    switch (key) {
      case "Enter":
        if (searchResults[activeItemIndex]) {
          onItemClick(searchResults[activeItemIndex]);
        } else {
          setMenuShown(false);
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
        setMenuShown(false);
        return;
    }
  };

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
      setMenuShown(false);
    }
  };

  React.useEffect(() => {
    if (expandOnMount) {
      setMenuShown(true);
    }
  }, []);
  React.useEffect(() => {
    // Need to do this in next event loop to prevent focus action on button
    // ref from triggering onClick on button again. Apparently this happens
    // when item is selected using Enter key, but not when selected using mouse click.
    setTimeout(() => {
      if (menuShown) {
        searchInputRef?.current?.focus();
      } else {
        buttonRef.current?.focus();
        setActiveItemIndex(-1);
      }
    }, 0);
  }, [menuShown]);

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
        buttonRef={buttonRef as React.RefObject<HTMLButtonElement>}
        onClick={() => setMenuShown(!menuShown)}
        label={buttonLabel}
        onKeyDown={(e) => onInputKeyDown(e.key)}
        ownedIDs={[dropdownID]}
        round="none"
      />
      {ReactDOM.createPortal(
        <DropdownWrapper
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
  height: 32px;
  border: 1px solid lightgrey;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid lightgrey;
`;
