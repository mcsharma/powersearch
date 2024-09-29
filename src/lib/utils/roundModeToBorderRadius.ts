import { TOKEN_BORDER_RADIUS } from "./constants";
import { RoundMode } from "./types";

export const roundModeToBorderRadius: { [key in RoundMode]: string } = {
  left: `${TOKEN_BORDER_RADIUS}px 0 0 ${TOKEN_BORDER_RADIUS}px`,
  right: `0 ${TOKEN_BORDER_RADIUS}px ${TOKEN_BORDER_RADIUS}px 0`,
  none: "0",
  all: `${TOKEN_BORDER_RADIUS}px`,
};
