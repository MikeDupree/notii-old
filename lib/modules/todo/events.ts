import { IpcMainEvent } from "electron";
import { readStore, updateDataStore, overwriteDataStore } from "../../store";

const updateStore = async (
  event: IpcMainEvent,
  userId: string,
  store: Record<string, unknown>,
  config?: { force: boolean }
) => {
  if (config?.force) {
    await overwriteDataStore("todo", userId, store);
    event.sender.send("todo:client", store);
    return;
  }
  const result = await updateDataStore("todo", userId, store?.data, config);
  event.sender.send("todo:client", store?.data);
};

const getHandler = (event, message) => {
  if (!message.userId) {
    event.sender.send("error", {
      type: "storeGet",
      message: "missing userId",
      requestLogin: true,
    });
    return;
  }
  const todos = readStore("todo", message.userId);
  event.sender.send("todo:client", todos);
};

const getSubscriber = {
  channel: "todo:get",
  callback: getHandler,
};

const createHandler = async (event, message) => {
  if (!message.userId) {
    event.sender.send("error", {
      type: "storeUpdate",
      message: "missing userId",
      requestLogin: true,
    });
    return;
  }
  const result = await updateDataStore("todo", message.userId, message);
  event.sender.send("todo:client", result?.data);
};

const createSubscriber = {
  channel: "todo:add",
  callback: createHandler,
};

const deleteHandler = (event, message) => {
  if (!message || !message.id) {
    console.log("no id, exiting");
    return;
  }

  let store = readStore("todo", message.userId);

  let count = store.data.length;
  // Filter out the entry being deleted.
  store.data = store.data.filter((entry) => entry.id !== message.id);

  // force update store data.
  updateStore(event, message.userId, store, { force: true });
};

const deleteSubscriber = {
  channel: "todo:delete",
  callback: deleteHandler,
};

export const subscribers = [getSubscriber, createSubscriber, deleteSubscriber];
