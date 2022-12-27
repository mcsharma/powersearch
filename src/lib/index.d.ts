import {
  DefaultTheme,
  StyledInterface,
  ThemedStyledComponentsModule,
} from "styled-components";

export {};

declare global {
  interface Window {
    styled: ThemedStyledComponentsModule<DefaultTheme> & StyledInterface;
  }
}
