import { IpcMainEvent } from "electron";
import { readStore, updateDataStore, overwriteDataStore } from "../../store";

const updateStore = async (
  event: IpcMainEvent,
  filename: string,
  store: Record<string, unknown>,
  config?: { force: boolean }
) => {
  if (config?.force) {
  }

  await overwriteDataStore("editor", filename, store);
  console.log("Sending message on editor:client");
};

const getHandler = (event, message) => {
  if (!message.filename) {
    event.sender.send("error", {
      type: "storeGet",
      message: "missing filename",
    });
    return;
  }
  const content = readStore("editor", message.filename);
  console.log("Sending message on editor:client");
  event.sender.send("editor:client", content);
};

const getSubscriber = {
  channel: "editor:get",
  callback: getHandler,
};

const updateHandler = async (event, message) => {
  console.log("Editor::updateHandler", message);
  if (!message.filename) {
    event.sender.send("error", {
      type: "storeGet",
      message: "missing filename",
    });
    return;
  }

  await updateStore(
    event,
    message.filename,
    { data: message.contents },
    { force: true }
  );

  console.log("Sending message on editor:client");
  event.sender.send("editor:client", message.content);
};

const updateSubscriber = {
  channel: "editor:update",
  callback: updateHandler,
};

const getFilesHandler = async (event, message) => {


};

const getFilesSubscriber = {
  channel: "editor:getFiles",
  callback: getFilesHandler,
};
export const subscribers = [getSubscriber, updateSubscriber];
