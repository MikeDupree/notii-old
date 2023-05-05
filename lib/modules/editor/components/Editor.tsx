import React, { useState } from "react";
import ReactQuill from "react-quill";

type Props = {};

const Editor = (props: Props) => {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    console.log("e", e);
    setValue(e);
  };
  return <ReactQuill theme="snow" value={value} onChange={onChange} />;
};

export default Editor;
