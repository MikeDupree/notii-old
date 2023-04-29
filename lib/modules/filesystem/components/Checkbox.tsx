import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface CheckboxProps {
  label: string;
}

export default function CheckboxLabels({ label }: CheckboxProps) {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox />} label={label} />
    </FormGroup>
  );
}
