import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Input from "@mui/material/Input";
import { TOKEN_COLOR } from "../utils/constants";

interface IDateInput {
  label: string;
  value: string | null;
  onChange: (date: string | null) => void;
}

export default function DateInput({ label, value, onChange }: IDateInput) {
  return (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      InputAdornmentProps={{
        sx: {
          marginLeft: "4px",
        },
      }}
      OpenPickerButtonProps={{
        disableFocusRipple: true,
        disableRipple: true,
        edge: "start",
        size: "small",
      }}
      renderInput={(props) => {
        return (
          <Input
            className="PS-DatePickerInput"
            {...props.InputProps}
            size="small"
            margin="none"
            sx={{
              fontSize: "0.875rem",
              border: `1px solid ${TOKEN_COLOR}`,
              width: 124,
              padding: "0 0 0 0.5rem",
            }}
            inputRef={props.inputRef}
            onChange={props.inputProps?.onChange}
            disableUnderline={true}
            slotProps={{
              input: {
                ...props.inputProps,
                style: { padding: "1px 0 0 0" },
              },
            }}
          />
        );
      }}
    />
  );
}
