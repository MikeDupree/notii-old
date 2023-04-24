import axios from "axios";
import React, { useEffect, useState } from "react";

type Props = {};

const FileExplorer = (props: Props) => {
  const [files, setFiles] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:8080/files?path=/home/mdupree")
      .then((res) => {
        setFiles(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  });
  console.log("files", files);
  return <div>FileExplorerFileExplorer</div>;
};

export default FileExplorer;
