import React, { useRef } from "react";
import Editor from "./components/Editor";

type Props = {};

const renderer = (props: Props) => {
  return (
    <div>
      <Editor />
    </div>
  );
};

export default renderer;
