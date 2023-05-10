import * as React from "react";
import CheckboxMUI, { CheckboxProps } from "@mui/material/Checkbox";
import { Typography } from "@mui/material";

interface CustomCheckboxProps extends Omit<CheckboxProps, "onChange"> {
  label: string;
  fieldName: string;
  value: boolean;
  onChange?: (change: { [key: string]: boolean }) => void;
}
const Checkbox = ({
  label,
  fieldName,
  value,
  disabled = false,
  onChange,
}: CustomCheckboxProps) => {
  const arialabel = { inputProps: { "aria-label": label } };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <div style={{ padding: "20px" }}>
        <Typography variant="subtitle1">{label}</Typography>
      </div>
      <div style={{ flexGrow: 1 }} />
      <div style={{ padding: "20px" }}>
        <CheckboxMUI
          {...arialabel}
          color="secondary"
          disabled={disabled}
          checked={value}
          onChange={() => {
            let o = {};
            o[fieldName] = !value;
            onChange?.(o);
          }}
        />
      </div>
    </div>
  );
};

export default Checkbox;
