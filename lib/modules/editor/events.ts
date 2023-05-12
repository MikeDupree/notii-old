import { IpcMainEvent } from "electron";
import { log } from "console";
import path from "path";
import fs from "fs";
import { outputFile } from "fs-extra";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import { json } from "stream/consumers";
import { EditorFile } from "./classes/EditorFile";

/*
 * Functions
 */
function ensureDirectoryExistence(filePath) {
  let dirname = path.dirname(filePath);
  console.log(`checking ${dirname} for existence`);
  if (fs.existsSync(dirname)) {
    console.log("    look at that lassies, i found", dirname);
    return true;
  }
  ensureDirectoryExistence(dirname);
  console.log("+   Creating ", dirname);
  fs.mkdirSync(dirname);
}

const getStorePath = () => {
  //TODO read OS type and determine path to store.
  // IE: Linux = ~/.config/notii/store
  const notesDir = `./store/notes`;

  ensureDirectoryExistence(notesDir);

  return notesDir;
};

interface WriteOptions {
  oldFilename?: string;
}

const overwriteDataStore = async (
  storeName: string,
  userId: string,
  filename: string,
  store: Record<string, unknown>,
  options?: WriteOptions
): Promise<{ success: boolean; message: string; data: unknown }> => {
  let response = {
    success: true,
    message: "Store sucess",
    data: null,
  };

  let storeFilePath = `${getStorePath()}/${userId}`;
  console.log(`CHECKING ${storeFilePath}`);
  ensureDirectoryExistence(storeFilePath);

  const file = `${storeFilePath}/${filename}.${storeName}.json`;

  if (options.oldFilename) {
    const oldStoreFilePath = `${userId}/${options.oldFilename}.${storeName}.json`;
    console.log("old store path", oldStoreFilePath);
    const oldFile = `${getStorePath()}/${oldStoreFilePath}`;
    if (oldFile !== file) {
      try {
        fs.renameSync(oldFile, file);
      } catch (e) {
        console.log(`Couldn't rename ${oldFile}, are you sure the file exists?`);
      }
    }
  }

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
  const filepath = `${getStorePath()}/${userId}/${filename}.${storeName}.json`;
  ensureDirectoryExistence(filepath);
  try {
    data = fs.readFileSync(filepath, {
      encoding: "utf8",
      flag: "r",
    });
  } catch (e) {
    console.log(
      `ERROR: Editor:events:readStore() cannot read. ${getStorePath()}/${userId}/${filename}.${storeName}.json does not exist.`
    );
  }
  if (!data) {
    return "";
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
  event.sender.send("editor:getFile", { type: "file:get", data: content });
};

const getSubscriber = {
  channel: "editor:get",
  callback: getHandler,
};

const updateHandler = async (event, message) => {
  console.log("Editor::updateHandler", message);
  const { userId, filename, contents, oldFilename } = message;

  const options = {
    oldFilename,
  };

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

  const store = { name: filename, author: userId, data: contents };
  await overwriteDataStore("editor", userId, filename, store, options);
  event.sender.send("editor:updateFile", {
    type: "file:update",
    data: message.content,
  });
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

  ensureDirectoryExistence(filepath);
  let files = [];
  try {
    files = fs.readdirSync(filepath, {
      encoding: "utf8",
    });
  } catch (e) {
    console.log("ERROR getFilesHandler readdirSync", e);
  }

  console.log("loaded files:", files);

  const result = files.map((file) => ({
    name: file.split(".")?.[0],
    filename: file,
    fullpath: `${process.cwd()}/store/notes/${userId}/${file}`,
  }));

  event.sender.send("editor:getFiles", { type: "files:get", data: result });
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
