import * as React from "react";
import * as ReactDOM from "react-dom";
import { getRandomString } from "../utils/random";
import DropdownMenuBase, {
  IDropdownMenuBase,
  MenuItem,
} from "./DropdownMenuBase";

interface IDropdownMenuWithSearch
  extends Omit<IDropdownMenuBase, "activeItemKey"> {
  shown: boolean;
  top: number;
  left: number;
  focusMode: "input" | "dropdown";
  setFocusMode: (mode: "input" | "dropdown") => void;
}

export default function DropdownMenuWithSearch({
  shown,
  top,
  left,
  items,
  onItemClick,
  focusMode,
  setFocusMode,
  ...remainingProps
}: IDropdownMenuWithSearch) {
  const searchInputID = React.useMemo(() => getRandomString(), []);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  // const itemsRef = React.useRef<Map<MenuItemKey, HTMLElement | null>>(
  //   new Map()
  // );

  const [query, setQuery] = React.useState("");
  const [searchResults, setSearchResults] =
    React.useState<Array<MenuItem>>(items);
  const [activeItemIndex, setActiveItemIndex] = React.useState<number>(-1);

  const onQueryChange = (q: string) => {
    setQuery(q);
    const newResults = items.filter((item) => item.label.includes(q.trim()));
    setSearchResults(newResults);
    setActiveItemIndex(newResults.length > 0 ? 0 : -1);
  };

  const onSearchKeyDown = (key: string) => {
    switch (key) {
      case "Enter":
        if (searchResults[activeItemIndex]) {
          onItemClick(searchResults[activeItemIndex]);
        }
        return;
      case "ArrowDown":
      case "Down":
        setActiveItemIndex(
          Math.min(activeItemIndex + 1, searchResults.length - 1)
        );
        return;
      case "ArrowUp":
      case "Up":
        if (activeItemIndex < 0) {
          setFocusMode("input");
          return;
        }
        setActiveItemIndex(activeItemIndex - 1);
        return;
    }
  };

  React.useEffect(() => {
    if (focusMode === "dropdown") {
      searchInputRef.current?.focus();
    }
  }, [focusMode]);
  React.useEffect(() => {
    if (!shown) {
      setQuery("");
      setSearchResults(items);
      setActiveItemIndex(-1);
    }
  }, [shown]);

  return ReactDOM.createPortal(
    <Root shown={shown} left={left} top={top}>
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
        {...remainingProps}
      />
    </Root>,
    document.body
  );
}

interface RootProps {
  left: number;
  top: number;
  shown: boolean;
}
const Root = window.styled.div.attrs(({ left, top, shown }: RootProps) => ({
  left,
  top,
  shown,
}))`
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
