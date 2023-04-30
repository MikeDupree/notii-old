import React from "react";
import ReactDiffViewer from "react-diff-viewer";

interface DiffProps {
  file: {
    src: string;
    cmp: string;
  };
  split?: boolean;
}

const Diff = ({ file, split = true }: DiffProps) => {
  if (!file) {
    return <></>;
  }
  return (
    <ReactDiffViewer
      oldValue={file.src}
      newValue={file.cmp}
      splitView={split}
      useDarkTheme
    />
  );
};

export default Diff;
