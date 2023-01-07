import * as React from "react";
import * as ReactDOM from "react-dom";
import { getRandomString } from "../utils/random";
import Button from "./Button";
import useForceRenderAfterMount from "../utils/useForceRenderAfterMount";
import DropdownMenuBase, { MenuItem } from "./DropdownMenuBase";

interface ISelectorWithSearch {
  label: string;
  placeholder: string;
  items: Array<MenuItem>;
  selectedItem: MenuItem | null;
  onSelect: (item: MenuItem) => void;
  // Optional Props *********
  expandOnMount?: boolean;
}

export default function SelectorWithSearch({
  label,
  placeholder,
  items,
  selectedItem,
  onSelect,
  expandOnMount,
}: ISelectorWithSearch) {
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
  const selectedItemIndex = items.findIndex(
    (item) => item.key === selectedItem?.key
  );

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
            activeItemIndex !== -1 ? activeItemIndex : selectedItemIndex;
          setActiveItemIndex((curIndex + 1) % searchResults.length);
        }
        return;
      case "ArrowUp":
      case "Up":
        if (searchResults.length > 0) {
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
        setMenuShown(false);
        return;
    }
  };
  const onItemClick = (item: MenuItem) => {
    onSelect(item);
    setMenuShown(false);
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

  const buttonLabel = selectedItem === null ? placeholder : selectedItem.label;
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
            selectedItemKey={selectedItem?.key ?? null}
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
