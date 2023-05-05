import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { ipcHandler } from "../../../../renderer/src/ipc";
import { ipcRenderer } from "electron";

interface ListChildComponentProps {
  index: string;
  style?: any;
}

function RenderRow(props: ListChildComponentProps) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

interface Props {
  onSelect?: (filename: string) => void;
}

export default function FileList({ onSelect }: Props) {
  const [files, setFiles] = useState<string[]>([]);
  const socket = ipcHandler("editor");
  const handleFilesGet = (event, message) => {
    console.log(`Editor socket message`);
    console.log(message);
    if (message && message.data) {
      console.log("set files", message.data);
      setFiles(message.data);
    }
  };
  console.log("regiserting handleFilesGet", ipcRenderer);
  ipcRenderer.addListener("editor:client", handleFilesGet);

  useEffect(() => {
    //request editor data for user.
    // emit this when first mounting to get current contents
    socket.send({ }, { channelOverride: "editor:getFiles" });

    return () => {
      // ipcRenderer.removeListener("editor:client", handleFilesGet);
    };
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <RenderRow index="1" />
    </Box>
  );
}
