import { OperatorType, SimpleFilter } from "./types";
import * as React from "react";
import { TOKEN_BORDER_RADIUS } from "./utils/constants";

type RoundMode = "left" | "right" | "none" | "both";

const roundModeToBorderRadius = {
  left: `${TOKEN_BORDER_RADIUS}px 0 0 ${TOKEN_BORDER_RADIUS}px`,
  right: `0 ${TOKEN_BORDER_RADIUS}px ${TOKEN_BORDER_RADIUS}px 0`,
  none: "0",
  both: `${TOKEN_BORDER_RADIUS}px`,
};
interface IToken {
  label: string;
  round: RoundMode;
}

const Root = window.styled.div.attrs(({ round }: { round: RoundMode }) => ({
  round,
}))`
  padding: 0 4px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(228 241 255);
  flex-shrink: 0;
  border-radius: ${({ round }) => roundModeToBorderRadius[round]}
`;

const Token: React.FC<IToken> = ({ label, round }) => {
  return <Root round={round}>{label}</Root>;
};

export default Token;
