import React, { useEffect, useState } from "react";
import Editor from "./components/Editor";

import { ipcHandler } from "../../../renderer/src/ipc";
import { ipcRenderer } from "electron";
import FileList from "./components/FileList";
import { useSession } from "next-auth/react";

type Props = {};

const renderer = (props: Props) => {
  const session = useSession();
  const [selected, setSelected] = useState<string>();
  const [contents, setContents] = useState<{ name: string; data: string }>();
  const socket = ipcHandler("editor");

  const fileGetHandler = (event, message) => {
    console.debug("filesGetHandler", message);
    if (message.type === "file:get") {
      setContents(message.data);
    }
  };
  ipcRenderer.addListener("editor:getFile", fileGetHandler);

  useEffect(() => {
    //request editor data for user.
    // emit this when first mounting to get current contents
    if (!selected) return;
    try {
      socket.send(
        { filename: selected, userId: session?.data?.user?.sub },
        { channelOverride: "editor:get" }
      );
    } catch (error) {
      console.log("send file get error", error);
    }
    return () => {
      // ipcRenderer.removeListener("editor:client", fileGetHandler);
    };
  }, [selected]);

  const onChangeHandler = (
    contents: string,
    options: { newFilename: string; oldFilename: string }
  ) => {
    setSelected(options.newFilename);
    socket.send(
      {
        userId: session?.data?.user?.sub,
        filename: options.newFilename ?? "untitled",
        oldFilename: options.oldFilename,
        contents,
      },
      { channelOverride: "editor:update" }
    );
  };

  return (
    <div id="EditorMain" className="full">
      {selected ? (
        <Editor
          onChange={onChangeHandler}
          onBackButton={() => setSelected("")}
          filename={contents?.name}
          data={contents?.data}
        />
      ) : (
        <FileList
          onSelect={(filename: string) => {
            console.log("setSelected", filename);
            setSelected(filename);
          }}
        />
      )}
    </div>
  );
};

export default renderer;
