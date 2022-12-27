import * as React from "react";
import PowerSearch from "../lib/PowerSearch";
import { schemaFields } from "./testSchema";

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
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Root>
        <PowerSearch schema={schemaFields} />
      </Root>
    </>
  );
};

export default App;
