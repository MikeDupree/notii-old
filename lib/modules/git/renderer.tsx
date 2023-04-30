import React, { useEffect, useState } from "react";
import Diff from "./components/diffViewer";

import { ipcHandler } from "../../../renderer/src/ipc";
import { ipcRenderer } from "electron";

type Props = {};

const renderer = (props: Props) => {

  const [file, setFile] = useState<{src: string, cmp: string} | undefined>();
  const socket = ipcHandler("git");
  const handleGitMessage = (event, message) => {
    console.log(`GIT socket message`);
    console.log(message);
    if (message && message.src) {
      console.log('set git file', message);
      setFile(message);
    }
  };
  console.log('regiserting handleGitMessage', ipcRenderer);
  ipcRenderer.addListener("git:client", handleGitMessage);

  useEffect(() => {

    //request git data for user.
    socket.send(
      {
        path: 'README.md',
        source: 'main',
        comparison: 'main'
      },
      { channelOverride: "git:getFile" }
    );

    return () => {
      // ipcRenderer.removeListener("todo:client", handleGitMessage);
    };
  }, []);


  return (
    <div>
      Git Diff
      <Diff file={file} />
    </div>
  );
};
export default renderer;
