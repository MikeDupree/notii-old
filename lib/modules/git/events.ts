import { getFile } from "./utils";
import { app, dialog } from "electron";
import fs from "fs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/node";

const errorHandler = (error: Error) => {
  console.log("Error :: ", error);
};

interface ResponseData {
  type: string;
  data: unknown;
  success: boolean;
  error?: string;
}

const createResponse = (data: ResponseData) => ({
  module: "git",
  ...data,
});

const getFileHandler = async (event, message) => {
  const { path, source, comparison } = message;
  if (!(path || source || comparison)) {
    event.sender.send("error", {
      type: "git",
      message: "expected: path, source, comparison",
    });
    return;
  }

  const sourceFile = await getFile(path, source).catch(errorHandler);
  const comparisonFile = await getFile(path, comparison).catch(errorHandler);

  console.log("Sending message on filesystem:client");
  event.sender.send(
    "git:client",
    createResponse({
      type: "git:diff",
      data: { src: sourceFile, cmp: comparisonFile },
      success: true,
    })
  );
};

const getFileSubscriber = {
  channel: "git:getFile",
  callback: getFileHandler,
};

const openDirectoryHandler = (event) => {
  console.log("Handle git:openDirectory");
  dialog
    .showOpenDialog({
      defaultPath: app.getPath("home"), // set the initial directory to the user's home directory
      properties: ["openDirectory"],
    })
    .then((result) => {
      if (!result.canceled) {
        console.log("results path", result);
        event.sender.send(
          "git:client",
          createResponse({
            type: "git:repoSelect",
            data: result.filePaths,
            success: true,
          })
        );
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const openDirectorySubscriber = {
  channel: "git:openDirectory",
  callback: openDirectoryHandler,
};

const getLog = async (event, message) => {
  console.log("Handle git:log", message);
  const { path } = message;
  if (!path) {
    return;
  }
  let log = [];
  let error;

  try {
    // Read the commit log
    log = await git.log({ fs, dir: path });

    // Print the commit log
    console.log("git:log", log);
  } catch (e) {
    console.error(e);
    error = e;
  }
  event.sender.send(
    "git:client",
    createResponse({
      type: "git:log",
      data: log,
      success: !(!!error),
      error: error
    })
  );
};

const gitLogSubscriber = {
  channel: "git:log",
  callback: getLog,
};

export const subscribers = [
  getFileSubscriber,
  openDirectorySubscriber,
  gitLogSubscriber,
];
