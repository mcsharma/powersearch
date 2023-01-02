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
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLSpanElement>
  ) => void;
  inputRef?:
    | React.RefObject<HTMLSpanElement>
    | React.RefObject<HTMLInputElement>;
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

export default function TextInput({
  autoGrow,
  placeholder,
  value,
  onChange,
  onKeyDown,
  onKeyUp,
  onFocus,
  onBlur,
  inputRef,
  border,
  borderColor,
  height = 32,
  width = "auto",
  maxWidth,
  minWidth = 110,
}: ITextInput) {
  const initialValue = React.useMemo(() => value, []);
  React.useEffect(() => {
    if (autoGrow) {
      setEndOfContenteditable(inputRef?.current ?? null);
    }
  }, []);

  // TODO: This is not working, not focussing on mount.
  React.useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, [!!inputRef?.current]);

  if (autoGrow) {
    return (
      <SpanInput
        height={height}
        width={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        ref={inputRef}
        border={border}
        borderColor={borderColor}
        role="textbox"
        placeholder={placeholder ?? ""}
        contentEditable={true}
        onInput={(e: React.FormEvent<HTMLSpanElement>) =>
          onChange(e.currentTarget.textContent ?? "")
        }
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {initialValue}
      </SpanInput>
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
      onKeyUp={onKeyUp}
      onBlur={onBlur}
      onFocus={onFocus}
      ref={(inputRef as React.RefObject<HTMLInputElement>) ?? undefined}
    />
  );
}

function setEndOfContenteditable(
  contentEditableElement: HTMLSpanElement | null
) {
  let range, selection;
  if (document.createRange && contentEditableElement) {
    //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange(); //Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection(); //get the selection object (allows you to change selection)
    selection?.removeAllRanges(); //remove any selections already made
    selection?.addRange(range); //make the range you have just created the visible selection
  }
}