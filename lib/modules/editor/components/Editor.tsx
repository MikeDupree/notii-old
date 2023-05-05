import { useSession } from "next-auth/react";
import React, { useState } from "react";
import ReactQuill from "react-quill";

type Props = {
 onChange?: (contents: string) => void;
 };

const Editor = ({onChange}: Props) => {
 const [value, setValue] = useState("");
 const session = useSession();
 console.log('editor session', session);

  const onChangeHandler = (e) => {
    console.log("e", e);
    setValue(e);
    onChange?.(e);
  };
  return <ReactQuill theme="snow" value={value} onChange={onChangeHandler} />;
};

export default Editor;
