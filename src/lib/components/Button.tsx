import * as React from "react";
import { TOKEN_COLOR, TOKEN_HEIGHT } from "../utils/constants";
import { RoundMode } from "../utils/types";
import { roundModeToBorderRadius } from "../utils/roundModeToBorderRadius";

interface IButton {
  label: string;
  round?: keyof typeof RoundMode;
  onClick?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  ownedIDs?: Array<string>;
  iconRight?: React.ReactNode;
}

export default function Button({
  label,
  round,
  ownedIDs,
  onClick,
  buttonRef,
  onKeyDown,
  iconRight,
}: IButton) {
  return (
    <Root
      ref={buttonRef}
      onKeyDown={onKeyDown}
      aria-label={label}
      onClick={onClick}
      round={round}
      hasIconRight={!!iconRight}
      aria-owns={ownedIDs ? ownedIDs.join(" ") : undefined}
    >
      {label}
      {iconRight}
    </Root>
  );
}

interface RootProps {
  round?: keyof typeof RoundMode;
  hasIconRight: boolean;
}
const Root = window.styled.button.attrs(
  ({ round, hasIconRight }: RootProps) => ({
    round,
    hasIconRight,
  })
)`
  border: none;
  border-radius: ${({ round }) => roundModeToBorderRadius[round ?? "all"]};
  padding: ${({ hasIconRight }) => (hasIconRight ? "0 8px 0 12px" : "0 12px")};
  box-sizing: border-box;
  height: ${TOKEN_HEIGHT}px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${TOKEN_COLOR};
  flex-shrink: 0;
  font-family: verdana;
  font-size: 14px;
  cursor: pointer;
  & > svg {
    pointer-events: none;
  }
`;
