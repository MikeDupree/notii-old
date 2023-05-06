import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { ipcHandler } from "../../../../renderer/src/ipc";
import { ipcRenderer } from "electron";
import { useSession } from "next-auth/react";

interface ListChildComponentProps {
  file: { name: string; filename: string; fullpath: string };
  index: string;
  style?: any;
  onClick: (filename: string) => void;
}

function RenderFileItem(props: ListChildComponentProps) {
  const { file, index, style, onClick } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton onClick={() => onClick(file.name)}>
        <ListItemText primary={file.name} />
      </ListItemButton>
    </ListItem>
  );
}

interface Props {
  onSelect?: (filename: string) => void;
}

export default function FileList({ onSelect }: Props) {
  const session = useSession();
  const [files, setFiles] = useState<
    { name: string; filename: string; fullpath: string }[]
  >([]);
  const socket = ipcHandler("editor");

  const filesGetHandler = (event, message) => {
    if (message.type === "files:get") {
      setFiles(message.data);
    }
  };
  ipcRenderer.addListener("editor:getFiles", filesGetHandler);

  const onFileClickHandler = (filename) => {
    onSelect?.(filename);
  };

  useEffect(() => {
    //request editor data for user.
    // emit this when first mounting to get current contents
    socket.send(
      { userId: session?.data?.user?.sub },
      { channelOverride: "editor:getFiles" }
    );

    return () => {
      // ipcRenderer.removeListener("editor:client", filesGetHandler);
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
      {files.map((file) => (
        <RenderFileItem
          index={file.name}
          file={file}
          onClick={onFileClickHandler}
        />
      ))}
    </Box>
  );
}
