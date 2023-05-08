import { IconButton, Input, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Props = {
  filename: string;
  data: string;
  onChange?: (
    contents: string,
    options: { oldFilename: string; newFilename: string }
  ) => void;
  onBackButton?: () => void;
};

const Editor = ({
  filename = "untitled",
  data,
  onChange,
  onBackButton,
}: Props) => {
  const [value, setValue] = useState(data);
  const [name, setName] = useState(filename);
  const session = useSession();
  console.log("editor session", session);

  useEffect(() => {
    setValue(data);
  }, [data]);

  const filenameOnChangeHandler = (e) => {
    console.log("filenameOnChangeHandler", e.target.value);
    const newFilename = e.target.value.replaceAll(" ", "_");

    setName(newFilename);
    if (newFilename === "") return;

    onChange?.(value, { newFilename: newFilename, oldFilename: filename });
  };

  const onChangeHandler = (e) => {
    console.log("e", e);
    setValue(e);
    onChange?.(e, { newFilename: name, oldFilename: filename });
  };

  return (
    <div className="Editor-Container full">
      <IconButton onClick={() => onBackButton?.()}>
        <ArrowBackIcon />
      </IconButton>
      <TextField
        id="Editor-filename-input"
        label="Filename"
        variant="standard"
        onChange={filenameOnChangeHandler}
        defaultValue="untitled"
        value={name}
        sx={{
          marginTop: "7px",
          marginLeft: "7px",
          fontSize: "1.2rem",
          fontWeight: "600",
        }}
      />

      <div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChangeHandler}
          className="module-renderer"
          style={{}}
        />
      </div>

      <div>status line</div>
    </div>
  );
};

export default Editor;
