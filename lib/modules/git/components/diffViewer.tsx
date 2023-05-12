import React from "react";
import ReactDiffViewer from "react-diff-viewer";
import { Typography } from "@mui/material";

interface DiffProps {
  file: {
    src: string;
    cmp: string;
  };
  split?: boolean;
}

const Diff = ({ file, split = false }: DiffProps) => {
  if (!file) {
    return <></>;
  }
  if (file.src === file.cmp) {
    return (
      <div>
        <Typography variant="body1" className="p-2 text-center">
          Diff
        </Typography>
        <Typography variant="subtitle1" className="p-2 text-center text-slate-700 dark:text-slate-300">
          File contents are identical.
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="body1" className="p-2 text-center">
        Diff
      </Typography>

      <ReactDiffViewer
        oldValue={file.src}
        newValue={file.cmp}
        splitView={split}
        useDarkTheme
      />
    </div>
  );
};

export default Diff;
