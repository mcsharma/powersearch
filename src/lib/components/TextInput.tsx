import * as React from "react";

type BorderType = "all" | "horizontal" | "bottom" | "none";

interface ITextInput {
  border?: BorderType;
  borderColor?: string;
  height?: "100%" | number;
  width?: "auto" | "100%" | number;
  minWidth?: number;
  maxWidth?: number;
  autoGrow?: boolean; // default false
  placeholder?: string; // default '' (empty string)
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  inputRef?: React.RefObject<HTMLElement>;
}

const SpanInput = window.styled.span.attrs(
  ({
    height,
    width,
    minWidth,
    maxWidth,
    border,
    borderColor,
  }: {
    minWidth: number;
    maxWidth: number;
    width: "auto" | "100%" | number;
    height: number | "100%";
    border: BorderType;
    borderColor: string;
  }) => ({
    minWidth: minWidth ?? undefined,
    maxWidth: maxWidth ?? undefined,
    width: typeof width === "string" ? width : `${width}px`,
    border,
    borderColor: borderColor ?? "lightgray",
    height: height === "100%" ? height : `${height}px`,
  })
)`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  min-width: ${({ minWidth }) => `${minWidth}px`}; 
  max-width: ${({ maxWidth }) => `${maxWidth}px`}; 
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  border: ${({ border, borderColor }) =>
    border === "all"
      ? `1px solid ${borderColor}`
      : border === "none"
      ? "0"
      : undefined};
  border-top: ${({ border, borderColor }) =>
    border === "horizontal" ? `1px solid ${borderColor}` : undefined};
  border-bottom: ${({ border, borderColor }) =>
    border === "horizontal" || border === "bottom"
      ? `1px solid ${borderColor}`
      : undefined};
  border-radius: ${({ border }) => (border === "all" ? "4px" : 0)};
  padding: 0 6px;
  line-height: 32px;
  outline: 0;
  &:focus {
    outline: none!important;
  }
`;

const Input = window.styled.input.attrs(
  ({
    height,
    width,
    minWidth,
    maxWidth,
    border,
    borderColor,
  }: {
    minWidth: number;
    maxWidth: number;
    width: "100%" | number;
    height: number | "100%";
    border: BorderType;
    borderColor: string;
  }) => ({
    minWidth: minWidth ?? undefined,
    maxWidth: maxWidth ?? undefined,
    width: width === "100%" ? width : `${width}px`,
    border,
    borderColor: borderColor ?? "lightgray",
    height: height === "100%" ? height : `${height}px`,
  })
)`
  box-sizing: border-box;
  min-width: ${({ minWidth }) => minWidth}; 
  max-width: ${({ maxWidth }) => maxWidth};
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  border: ${({ border, borderColor }) =>
    border === "all"
      ? `1px solid ${borderColor}`
      : border === "none"
      ? "0"
      : undefined};
  border-top: ${({ border, borderColor }) =>
    border === "horizontal" ? `1px solid ${borderColor}` : undefined};
  border-bottom: ${({ border, borderColor }) =>
    border === "horizontal" || border === "bottom"
      ? `1px solid ${borderColor}`
      : undefined};
  border-radius: ${({ border }) => (border === "all" ? "4px" : 0)};
  padding: 0 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0;
  &:focus {
    outline: none!important;
  }

`;

const TextInput: React.FC<ITextInput> = ({
  autoGrow,
  placeholder,
  value,
  onChange,
  onEnter,
  inputRef,
  border,
  borderColor,
  height = 32,
  width = "auto",
  maxWidth,
  minWidth = 72,
}) => {
  const onKeyDown = (e: KeyboardEvent) =>
    e.key === "Enter" ? onEnter && onEnter() : null;

  if (autoGrow) {
    return (
      <SpanInput
        height={height}
        width={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        inputRef={inputRef}
        border={border}
        borderColor={borderColor}
        role="textbox"
        placeholder={placeholder ?? ""}
        contentEditable={true}
        onInput={(e: React.FormEvent<HTMLSpanElement>) =>
          onChange(e.currentTarget.textContent ?? "")
        }
        onKeyDown={onKeyDown}
      ></SpanInput>
    );
  }
  return (
    <Input
      type="text"
      height={height}
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
      border={border}
      borderColor={borderColor}
      placeholder={placeholder ?? ""}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      onKeyDown={onKeyDown}
      ref={inputRef ?? undefined}
    />
  );
};

export default TextInput;
