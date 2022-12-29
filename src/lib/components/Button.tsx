import * as React from "react";
import { getRandomString } from "../utils/random";
import { TOKEN_COLOR } from "../utils/constants";
import { RoundMode } from "../utils/types";
import { roundModeToBorderRadius } from "../utils/roundModeToBorderRadius";

export interface MenuItem {
  label: string;
  key: string | number;
}
interface IButton {
  label: string;
  round: RoundMode;
  onClick: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLButtonElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  ownedIDs: Array<string>;
}

export default function Button({
  label,
  round,
  ownedIDs,
  onClick,
  buttonRef,
  onKeyDown,
}: IButton) {
  return (
    <Root
      ref={buttonRef}
      onKeyDown={onKeyDown}
      aria-label={label}
      onClick={onClick}
      round={round}
      aria-owns={ownedIDs.join(" ")}
    >
      {label}
    </Root>
  );
}

interface RootProps {
  round: RoundMode;
}
const Root = window.styled.button.attrs(({ round }: RootProps) => ({
  round,
}))`
  border: none;
  border-radius: ${({ round }) => roundModeToBorderRadius[round]};
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${TOKEN_COLOR};
  flex-shrink: 0;
  font-family: verdana;
  font-size: 14px;
  cursor: pointer;
`;

const ResultItem = window.styled.li.attrs(
  ({ isSelected }: { isSelected: boolean }) => ({ isSelected })
)`
  box-sizing: border-box;
  display: flex;
  height: 32px;
  align-items: center;
  background-color: ${({ isSelected }) => {
    return isSelected ? TOKEN_COLOR : "white";
  }};
  :hover {
    background: ${TOKEN_COLOR};
  }
  &:first-child {
    border-radius: 2px 2px 0 0;
  }
  &:last-child {
    border-radius: 0 0 6px 6px;
  }
  cursor: pointer;
`;

const ResultItemDefaultRenderer = window.styled.div`
  padding-left: 12px; 
`;
