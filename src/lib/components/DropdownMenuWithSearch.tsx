import * as React from "react";
import * as ReactDOM from "react-dom";
import { getRandomString } from "../utils/random";
import { TOKEN_COLOR } from "../utils/constants";
import DropdownMenuBase, {
  IDropdownMenuBase,
  MenuItem,
  MenuItemKey,
} from "./DropdownMenuBase";

interface IDropdownMenuWithSearch extends IDropdownMenuBase {
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
  const [activeItemIndex, setActiveItemIndex] = React.useState<number | null>(
    null
  );

  const onQueryChange = (q: string) => {
    setQuery(q);
    const newResults = items.filter((item) => item.label.includes(q.trim()));
    setSearchResults(newResults);
    setActiveItemIndex(newResults.length > 0 ? 0 : null);
  };

  const onSearchKeyDown = (key: string) => {
    switch (key) {
      case "Enter":
        if (activeItemIndex !== null && searchResults[activeItemIndex]) {
          onItemClick(searchResults[activeItemIndex]);
        }
        return;
      case "ArrowDown":
      case "Down":
        console.log("arrow down on dropdown..");
        if (searchResults.length === 0) {
          return;
        }
        setActiveItemIndex(
          activeItemIndex === null
            ? 0
            : Math.min(activeItemIndex + 1, searchResults.length - 1)
        );
        return;
      case "ArrowUp":
      case "Up":
        console.log("arrow up on dropdown..");
        if (activeItemIndex === null) {
          setFocusMode("input");
          return;
        }
        if (activeItemIndex === 0) {
          setActiveItemIndex(null);
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
      setActiveItemIndex(null);
    }
  }, [shown]);

  console.log(activeItemIndex);
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
        activeItemKey={
          activeItemIndex === null ? null : searchResults[activeItemIndex].key
        }
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
