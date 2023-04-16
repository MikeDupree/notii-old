import { IpcMainEvent } from "electron";
import { readStore, updateDataStore } from "../store";

const updateStore = async (
  event: IpcMainEvent,
  userId: string,
  data: Record<string, unknown>,
  config?: { force: boolean }
) => {
  const result = await updateDataStore("todo", userId, data, config);
  console.log("updateDataStore result:", result);
  event.sender.send("todo:client", data);
};

const getHandler = (event, message) => {
  console.log("todo:get message:", message);
  if (!message.userId) {
    console.log("error: no user id passed to TODO listener");
    event.sender.send("error", {
      type: "storeGet",
      message: "missing userId",
      requestLogin: true,
    });
    return;
  }
  console.log("got userid");
  const todos = readStore("todo", message.userId);
  console.log("todos", todos);
  event.sender.send("todo:client", todos);
};

const getSubscriber = {
  channel: "todo:get",
  callback: getHandler,
};

const createHandler = async (event, message) => {
  console.log("todo::createHandler", message);
  console.log(typeof message);
  if (!message.userId) {
    console.log("error: no user id passed to TODO listener");
    event.sender.send("error", {
      type: "storeUpdate",
      message: "missing userId",
      requestLogin: true,
    });
    return;
  }
  console.log("got userid");
  const result = await updateDataStore("todo", message.userId, message);
  console.log("updateDataStore result:", result);
  event.sender.send("todo:client", result?.data);
};

const createSubscriber = {
  channel: "todo:add",
  callback: createHandler,
};

const deleteHandler = (event, message) => {
  console.log("todo::deleteHandler", message);
  if (!message || !message.id) {
    console.log("no id, exiting");
    return;
  }

  console.log("read store");

  let store = readStore("todo", message.userId);

  console.log("store data:", store.data);

  let count = store.data.length;
  store.data = store.data.filter((entry) => entry.id !== message.id);
  count = count - store.data.length;
  console.log("Entries Deleted:  ", count);
  updateStore(event, message.userId, store, { force: true });
};

const deleteSubscriber = {
  channel: "todo:delete",
  callback: deleteHandler,
};

export const subscribers = [getSubscriber, createSubscriber, deleteSubscriber];
