import * as React from "react";
import { TOKEN_BORDER_RADIUS } from "./util/constants";
import CrossIcon from "./icons/cross";

interface IRemoveFilterButton {
  onClick: () => void;
}
const Root = window.styled.button`
  display: flex;
  background-color: rgb(228 241 255);
  border: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 0 ${TOKEN_BORDER_RADIUS}px ${TOKEN_BORDER_RADIUS}px 0`;

const RemoveFilterButton: React.FC<IRemoveFilterButton> = ({ onClick }) => (
  <Root onClick={() => onClick()} aria-label="Delete">
    <CrossIcon />
  </Root>
);

export default RemoveFilterButton;
