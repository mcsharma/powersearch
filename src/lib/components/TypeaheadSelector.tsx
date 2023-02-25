import * as React from "react";
import * as ReactDOM from "react-dom";
import Token from "../Token";
import { TOKEN_COLOR } from "../utils/constants";
import { getRandomString } from "../utils/random";
import useForceRenderAfterMount from "../utils/useForceRenderAfterMount";
import DropdownMenuBase, { MenuItem } from "./DropdownMenuBase";
import { ISelector } from "./Selector";
import TextInput from "./TextInput";

interface ITypeaheadSelector
  extends Omit<ISelector<Array<MenuItem>>, "withSearch"> {
  // To force the selection's type to be non-nullable
  selection: Array<MenuItem>;
}
export default function TypeaheadSelector({
  label,
  placeholder,
  items,
  selection,
  onSelectionChange,
  onDropdownOpen,
  onDropdownClose,
  expandOnMount,
}: ITypeaheadSelector) {
  const dropdownID = React.useMemo(() => getRandomString(), []);
  const dropdownRootRef = React.useRef<HTMLDivElement>(null);
  const [menuShown, _setMenuShown] = React.useState<boolean>(false);
  // Using a refs as well so that we have access to the latest state inside event listener
  // https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state
  const menuShownRef = React.useRef<boolean>(false);
  const onDropdownOpenRef = React.useRef(onDropdownOpen);
  const onDropdownCloseRef = React.useRef(onDropdownClose);
  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(-1);

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
      setActiveItemIndex(-1);
    }
  }

  const onItemClick = (clickedItem: MenuItem, index: number) => {
    let newSelection = selection;
    if (selection.find((item) => item.key === clickedItem.key)) {
      newSelection = selection.filter((item) => item.key !== clickedItem.key);
    } else {
      newSelection = [...selection, clickedItem];
    }
    onSelectionChange(newSelection);
    setActiveItemIndex(index);
    searchInputRef.current?.focus();
  };

  React.useEffect(() => {
    if (expandOnMount) {
      searchInputRef.current?.focus();
      openMenu();
    }
    function globalClickHandler(event: MouseEvent) {
      if (dropdownRootRef.current) {
        if (
          !dropdownRootRef.current.contains(event.target as Node) &&
          event.target !== searchInputRef.current
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

  const buttonClientRect = searchInputRef.current?.getBoundingClientRect();
  const { left: buttonPosLeft, bottom: buttonPosBottom } =
    buttonClientRect ?? {};

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
          setActiveItemIndex((activeItemIndex + 1) % searchResults.length);
        }
        return;
      case "ArrowUp":
      case "Up":
        if (searchResults.length > 0) {
          if (activeItemIndex === -1) {
            setActiveItemIndex(searchResults.length - 1);
          } else {
            setActiveItemIndex(
              (activeItemIndex - 1 + searchResults.length) %
                searchResults.length
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
      setActiveItemIndex(-1);
    }
  }, [menuShown]);

  return (
    <>
      <TextInput
        onFocus={openMenu}
        inputRef={searchInputRef}
        id={searchInputID}
        placeholder={placeholder}
        aria-label="Search dropdown items"
        width={100}
        borderRadius={0}
        borderColor={TOKEN_COLOR}
        value={query}
        onChange={onQueryChange}
        onKeyDown={(e) => onSearchKeyDown(e.key)}
      />
      {ReactDOM.createPortal(
        <DropdownWrapper
          ref={dropdownRootRef}
          shown={menuShown}
          top={(buttonPosBottom ?? 0) + 5}
          left={buttonPosLeft ?? 0}
        >
          <DropdownMenuBase
            items={searchResults}
            activeItemKey={searchResults[activeItemIndex]?.key ?? null}
            onItemClick={onItemClick}
            id={dropdownID}
            label={label}
            selectedItemKeys={selection.map((item) => item.key)}
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
