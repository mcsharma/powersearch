import * as React from "react";
import { TOKEN_COLOR } from "../utils/constants";
import { RoundMode } from "../utils/types";
import { roundModeToBorderRadius } from "../utils/roundModeToBorderRadius";
import Icon, { IconType } from "../icons/Icon";

interface IButton {
  label: string;
  round: RoundMode;
  onClick: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLButtonElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  ownedIDs: Array<string>;
  icon?: IconType;
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
      <Icon name="caret-down" margin="3px 0 0 4px" color={"#646464"} />
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

const ButtonIcon = window.styled(Icon)`
  &svg {
    margin: 3px 0 0 4px;
  }
`;
