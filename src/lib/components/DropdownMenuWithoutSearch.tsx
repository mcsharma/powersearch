import * as React from "react";
import * as ReactDOM from "react-dom";
import { getRandomString } from "../utils/random";
import { TOKEN_COLOR } from "../utils/constants";
import DropdownMenuBase, { IDropdownMenuBase } from "./DropdownMenuBase";
// import "bootstrap-icons/icons/check.svg";

interface IDropdownMenuWithoutSearch extends IDropdownMenuBase {
  shown: boolean;
  left: number;
  top: number;
}

export default function DropdownMenuWithoutSearch({
  shown,
  left,
  top,
  ...remainingProps
}: IDropdownMenuWithoutSearch) {
  return ReactDOM.createPortal(
    <Root shown={shown} left={left} top={top}>
      <DropdownMenuBase {...remainingProps} />
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
    return shown ? undefined : "none";
  }};
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  position: absolute;
  box-shadow: 0  5px 10px rgba(154,160,185,0.05), 0 15px 40px rgba(166,173,201,0.2);
`;
