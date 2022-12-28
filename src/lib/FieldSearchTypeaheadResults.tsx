import { Field, FieldBase, SimpleFilter } from "./types";
import * as React from "react";
import Token from "./Token";
import { schemaFields } from "../app/testSchema";
import debounce from "./utils/debounce";
import * as ReactDOM from "react-dom";

interface IFieldSearchTypeaheadResults {
  results: Array<FieldBase>;
  left: number;
  top: number;
  onSelect: (result: FieldBase) => void;
}
const FieldSearchTypeaheadResults: React.FC<IFieldSearchTypeaheadResults> = ({
  results,
  left,
  top,
  onSelect,
}) => {
  return (
    <Root left={left} top={top}>
      {results.map((result) => (
        <ResultItem key={result.name} onClick={() => onSelect(result)}>
          {result.name}
        </ResultItem>
      ))}
    </Root>
  );
};

interface RootProps {
  left: number;
  top: number;
}
const Root = window.styled.div.attrs(({ left, top }: RootProps) => ({
  left,
  top,
}))`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: ${(props) => `${props.left}px`};
  top: ${(props) => `${props.top}px`};
  border: 1px solid gray;
  background-color: white;
  min-width: 240px;
`;

const ResultItem = window.styled.button`
  border: 0;
  box-sizing: border-box;
  display: flex;
  height: 28px;
  align-items: center;
  &:not(:last-child) {
    border-bottom: 1px solid gray;
    margin-bottom: 4px;
  }
  background-color: white;
`;

export default FieldSearchTypeaheadResults;
