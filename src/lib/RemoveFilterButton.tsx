import * as React from "react";
import {
  TOKEN_BORDER_RADIUS,
  TOKEN_COLOR,
  TOKEN_HEIGHT,
} from "./utils/constants";
import Icon from "./icons/Icon";

interface IRemoveFilterButton {
  onClick: () => void;
}
const Root = window.styled.button`
  display: flex;
  height: ${TOKEN_HEIGHT}px;
  background-color: ${TOKEN_COLOR};
  border: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 0 ${TOKEN_BORDER_RADIUS}px ${TOKEN_BORDER_RADIUS}px 0;
  box-sizing: border-box;
  padding: 0 8px;
  `;

const RemoveFilterButton: React.FC<IRemoveFilterButton> = ({ onClick }) => (
  <Root onClick={() => onClick()} aria-label="Delete">
    <Icon name="cross" />
  </Root>
);

export default RemoveFilterButton;
