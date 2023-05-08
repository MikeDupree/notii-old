import React, { useState } from "react";
import Radio from "./components/Radio";
type Props = {};
type ConfigItem = {
  label: string;
  fieldName?: string;
  value: boolean | string;
};

const defaultSettings: ConfigItem[] = [
  {
    label: "Developer Mode",
    fieldName: "devMode",
    value: false,
  },

  {
    label: "Dark Mode",
    fieldName: "darkMode",
    value: false,
  },
];

const getItemValue = (fieldName: string) => {
  // load store
  // get value
  return false;
};

const renderer = (props: Props) => {
  const [options, setOptions] = useState<ConfigItem[]>(defaultSettings);
  console.log("opts", options);
  // Add more config here...

  const handleChange = (change) => {
    console.log(change);
    // todo fix this. setup store for settings'
    setOptions({ ...options, ...change });
  };

  if (!Array.isArray(options)) {
    return null;
  }
  return (
    <div>
      {options.map(({ label, fieldName, value }) => (
        <Radio
          label={label}
          fieldName={fieldName || label.toLowerCase().replaceAll(" ", "_")}
          value={value as boolean}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

export default renderer;
