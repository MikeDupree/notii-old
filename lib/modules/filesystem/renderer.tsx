import axios from "axios";
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import FileList from "./components/FileList";
import TextInput from "./components/TextInput";

type Props = {};

const FileExplorer = (props: Props) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:8080/data?path=/home/mdupree")
      .then((res) => {
        setFiles(res.data.data);
        setError(res.data.error);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  console.log("files", files);
  return (
    <div class="h-screen w-screen bg-gray-100">
      <Box>
        <TextInput />
      </Box>
      <FileList files={files} />
    </div>
  );
};

export default FileExplorer;
