import { Input, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";

type Props = {
  filename: string;
  data: string;
  onChange?: (contents: string) => void;
};

const Editor = ({ filename = "untitled", data, onChange }: Props) => {
  const [value, setValue] = useState(data);
  const [name, setName] = useState(filename);
  const session = useSession();
  console.log("editor session", session);

  useEffect(() => {
    setValue(data);
  }, [data]);

  const filenameOnChangeHandler = (e) => {
    console.log("filenameOnChangeHandler", e.target.value);
    setName(e.target.value);
  };
  const onChangeHandler = (e) => {
    console.log("e", e);
    setValue(e);
    onChange?.(e);
  };
  return (
    <div className="Editor-Container">
      <TextField
        id="Editor-filename-input"
        label="Filename"
        variant="standard"
        onChange={filenameOnChangeHandler}
        defaultValue="untitled"
        value={filename}
      />
      <ReactQuill theme="snow" value={value} onChange={onChangeHandler} />
    </div>
  );
};

export default Editor;
