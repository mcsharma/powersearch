import * as React from "react";
import { TOKEN_COLOR } from "./utils/constants";
import { roundModeToBorderRadius } from "./utils/roundModeToBorderRadius";
import { RoundMode } from "./utils/types";

interface IToken {
  label: string;
  round: RoundMode;
}

const Root = window.styled.div.attrs(({ round }: { round: RoundMode }) => ({
  round,
}))`
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${TOKEN_COLOR};
  flex-shrink: 0;
  border-radius: ${({ round }) => roundModeToBorderRadius[round]}
`;

const Token: React.FC<IToken> = ({ label, round }) => {
  return <Root round={round}>{label}</Root>;
};

export default Token;
