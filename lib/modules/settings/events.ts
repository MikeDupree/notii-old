import { IpcMainEvent } from "electron";
import { readStore, updateDataStore, overwriteDataStore } from "../../store";
import defaultSettings from "./default.settings";

const updateStore = async (
  event: IpcMainEvent,
  userId: string,
  store: Record<string, unknown>,
  config?: { force: boolean }
) => {
  console.log("Sending message on settings:client");
  if (config?.force) {
    await overwriteDataStore("settings", userId, store);
    event.sender.send("settings:client", store);
    return;
  }
  await updateDataStore("settings", userId, store, config);
  event.sender.send("settings:client", store?.data);
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

  console.log('Reading settings store, will create if nonexistent');
  console.log('default settings', defaultSettings);
  const todos = readStore("settings", message.userId, {
    initData: defaultSettings,
  });

  console.log("Sending message on settings:client");
  event.sender.send("settings:client", todos);
};

const getSubscriber = {
  channel: "settings:get",
  callback: getHandler,
};

const updateHandler = async (event, message) => {
  if (!message.userId) {
    event.sender.send("error", {
      type: "storeUpdate",
      message: "missing userId",
      requestLogin: true,
    });
    return;
  }

  if (!message.data) {
    event.sender.send("error", {
      type: "storeUpdate",
      message: "missing data",
      requestLogin: true,
    });
    return;
  }
  console.log('Sending message on settings:client');
  const result = await updateDataStore("settings", message.userId, message.data);
  event.sender.send("settings:client", result?.data);
};

const createSubscriber = {
  channel: "settings:add",
  callback: updateHandler,
};


export const subscribers = [getSubscriber, createSubscriber];
