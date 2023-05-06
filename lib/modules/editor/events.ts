import { IpcMainEvent } from "electron";
import { log } from "console";
import path from "path";
import fs from "fs";
import { outputFile } from "fs-extra";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import { json } from "stream/consumers";

/*
 * Functions
 */
function ensureDirectoryExistence(filePath) {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

const getStorePath = () => {
  //TODO read OS type and determine path to store.
  // IE: Linux = ~/.config/notii/store
  return "./store/notes/";
};

const overwriteDataStore = async (
  storeName: string,
  userId: string,
  filename: string,
  store: Record<string, unknown>
): Promise<{ success: boolean; message: string; data: unknown }> => {
  let response = {
    success: true,
    message: "Store sucess",
    data: null,
  };
  let storeFilePath = `${userId}/${filename}.${storeName}.json`;
  const file = `${getStorePath()}/${storeFilePath}`;

  outputFile(file, JSON.stringify(store))
    .then(() => {
      console.log("The file has been saved!");
    })
    .catch((err) => {
      console.log("file write err:", err);
    });

  response.data = store;
  return response;
};

const readStore = (storeName: string, userId: string, filename: string) => {
  let data = null;
  if (!storeName || !userId || !filename) {
    return;
  }
  try {
    data = fs.readFileSync(
      `${getStorePath()}/${userId}/${filename}.${storeName}.json`,
      {
        encoding: "utf8",
        flag: "r",
      }
    );
  } catch (e) {
    console.log("=!= Store Read Error =!=");
    console.log(e);
    console.log("=i= Store Read Error =i=");
    return;
  }
  if (!data) {
    return;
  }
  return JSON.parse(data);
};

/*
 * Handlers
 */

const getHandler = (event, { userId, filename }) => {
  if (!filename) {
    event.sender.send("error", {
      type: "storeGet",
      message: "missing filename",
    });
    return;
  }
  if (!userId) {
    event.sender.send("error", {
      type: "storeGet",
      message: "missing userId",
    });
    return;
  }
  const content = readStore("editor", userId, filename);
  console.log("Sending message on readStore() editor:client");
  event.sender.send("editor:getFile", {type: 'file:get', data: content});
};

const getSubscriber = {
  channel: "editor:get",
  callback: getHandler,
};

const updateHandler = async (event, message) => {
  console.log("Editor::updateHandler", message);
  const { userId, filename, contents } = message;

  if (!userId) {
    event.sender.send("error", {
      type: "storeGet",
      message: "missing userId",
    });
    return;
  }

  if (!filename) {
    event.sender.send("error", {
      type: "storeGet",
      message: "missing filename",
    });
    return;
  }

  console.log("");
  console.log("Writing File Data");
  console.log("");

  const store = { name: filename, author: userId, data: contents };
  await overwriteDataStore("editor", userId, filename, store);
  console.log("Sending message on updateHandler() editor:client");
  event.sender.send("editor:updateFile", {type: 'file:update', data: message.content});
};

const updateSubscriber = {
  channel: "editor:update",
  callback: updateHandler,
};

const getFilesHandler = async (event, { userId }) => {
  console.log("getFilesHandler");
  if (!userId) {
    return;
  }
  const filepath = `${getStorePath()}/${userId}`;

  const files = fs.readdirSync(filepath, {
    encoding: "utf8",
  });
  console.log("files", files);
  const result = files.map((file) => ({
    name: file.split(".")?.[0],
    filename: file,
    fullpath: `${process.cwd()}/store/notes/${userId}/${file}`,
  }));

  console.log('sending message on getFilesHandler() editor:client');
  event.sender.send("editor:getFiles", {type: 'files:get', data: result});
};

const getFilesSubscriber = {
  channel: "editor:getFiles",
  callback: getFilesHandler,
};

export const subscribers = [
  getSubscriber,
  updateSubscriber,
  getFilesSubscriber,
];
