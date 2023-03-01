import { LocalizationProvider } from "@mui/x-date-pickers";
import * as React from "react";
import PowerSearch from "../lib/PowerSearch";
import { schemaFields } from "./testSchema";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const styled = window.styled;

const Root = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const GlobalStyle = styled.createGlobalStyle`
  body {
    margin: 0;
    font-family: verdana;
    font-size: 14px;
  }
  [contenteditable="true"]:empty:before {
    content: attr(placeholder);
    color: gray;
    font-size: 13px;
  }
`;

const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <GlobalStyle />
      <Root>
        <PowerSearch schema={schemaFields} />
      </Root>
    </LocalizationProvider>
  );
};

export default App;
