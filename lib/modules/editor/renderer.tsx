import React, { useEffect, useState } from "react";
import Editor from "./components/Editor";

import { ipcHandler } from "../../../renderer/src/ipc";
import { ipcRenderer } from "electron";
import FileList from "./components/FileList";

type Props = {};

const renderer = (props: Props) => {
  const [selected, setSelected] = useState<string>();
  const [contents, setContents] = useState<string>("");
  const socket = ipcHandler("editor");
  const handleTodoUpdate = (event, message) => {
    console.log(`Editor socket message`);
    console.log(message);
    if (message && message.data) {
      setContents(message.data);
    }
  };
  console.log("regiserting handleTodoUpdate", ipcRenderer);
  ipcRenderer.addListener("editor:client", handleTodoUpdate);

  useEffect(() => {
    //request editor data for user.
    // emit this when first mounting to get current contents
    socket.send({ filename: "untitled" }, { channelOverride: "editor:get" });

    return () => {
      // ipcRenderer.removeListener("editor:client", handleTodoUpdate);
    };
  }, []);

  const onChangeHandler = (contents: string) => {
    console.log("contents", contents);
    socket.send(
      { filename: "untitled", contents },
      { channelOverride: "editor:update" }
    );
  };

  if (false && !selected) {
    return (
      <div>
        <FileList />
      </div>
    );
  }

  return (
    <div>
      <Editor onChange={onChangeHandler} />
        <FileList />
    </div>
  );
};

export default renderer;
