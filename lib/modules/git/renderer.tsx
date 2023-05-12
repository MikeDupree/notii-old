import React, { useEffect, useState } from "react";

// TODO how should we handle other module dependencies
import FileList from "../filesystem/components/FileList";

import Diff from "./components/diffViewer";
import SelectGitRepo from "./components/selectRepo";
import { ipcHandler } from "../../../renderer/src/ipc";
import { ipcRenderer } from "electron";
import Layout from "./components/Layout";
import axios from "axios";

type Props = {};

const renderer = (props: Props) => {
  // TODO Remove default and let selector handle it.
  // TODO Add favorites or last opened state
  const [selectedRepo, setSelectedRepo] = useState<string>(
    "/home/mdupree/dev/github/notii"
  );
  const [file, setFile] = useState<{ src: string; cmp: string } | undefined>();
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  console.log("selectedRepo:", selectedRepo);
  console.log("file:", file);
  console.log("files:", files);
  const socket = ipcHandler("git");

  /*
   * Handles channel messages to client
   */
  const handleGitMessage = (event, message) => {
    console.log(`GIT socket message`);
    console.log(message);
    console.log("");
    if (message && message.type) {
      switch (message.type) {
        case "git:log":
          setLogs(message.data);
          break;
        case "git:diff":
          setFile(message.data);
          break;
        case "git:repoSelect":
          // The dir selector returns an array
          // for now just grab the first index if it exists.
          setSelectedRepo(message.data?.[0]);
          break;
      }
    }
  };
  ipcRenderer.addListener("git:client", handleGitMessage);

  useEffect(() => {
    if (selectedRepo) {
      axios
        .get(`http://localhost:8080/data?path=${selectedRepo}`)
        .then((res) => {
          setFiles(res.data.data);
          setError(res.data.error);
        })
        .catch((e) => {
          console.log(e);
        });
      console.log("send git:log");
      socket.send(
        {
          path: selectedRepo,
        },
        { channelOverride: "git:log" }
      );
    }
  }, [selectedRepo]);

  useEffect(() => {
    //request git data for user.
    socket.send(
      {
        path: "README.md",
        source: "main",
        comparison: "main",
      },
      { channelOverride: "git:getFile" }
    );

    return () => {
      // ipcRenderer.removeListener("todo:client", handleGitMessage);
    };
  }, []);

  if (!selectedRepo) {
    return (
      <Layout title="No Repo Selected">
        <SelectGitRepo />
      </Layout>
    );
  }

  return (
    <>
      <Layout title={selectedRepo} leftCol={<FileList files={files} />}>
        <Diff file={file} />
      </Layout>
      <ul>
      {logs.map((log) => {
        console.log(log);
        return <li> {log.commit.message} </li>;
      })}
      </ul>
    </>
  );
};
export default renderer;
