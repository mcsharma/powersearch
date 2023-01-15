import * as React from "react";
import * as ReactDOM from "react-dom";
import DropdownMenuBase, { IDropdownMenuBase } from "./DropdownMenuBase";

interface IDropdownMenu extends IDropdownMenuBase {
  shown: boolean;
  left: number;
  top: number;
  rootRef?: React.RefObject<HTMLDivElement>;
}

export default function DropdownMenu({
  shown,
  left,
  top,
  rootRef,
  ...remainingProps
}: IDropdownMenu) {
  return ReactDOM.createPortal(
    <Root shown={shown} left={left} top={top} ref={rootRef}>
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
