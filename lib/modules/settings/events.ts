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
  updateDataStore("settings", userId, store, config);
  event.sender.send("settings:client", store?.data);
};

const getHandler = (event, message) => {
  if (!message.userId) {
    console.log("Settings: event::get No UserId");
    // event.sender.send("error", {
    //   type: "storeGet",
    //   message: "missing userId",
    //   requestLogin: true,
    // });
    return;
  }
  let settings = {};
  try {
    settings = readStore("settings", message.userId, {
      initData: defaultSettings,
      runCount: 1,
    });
  } catch (e) {
    console.log("here lies the bug", e);
  }
  console.log("Sending message on settings:client", settings);
  event.sender.send("settings:client", settings);
};

const getSubscriber = {
  channel: "settings:get",
  callback: getHandler,
};

const updateHandler = async (event, message) => {
  console.log("Settings::updateHandler");
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
  console.log("updating settings config", message.data);
  const result = updateDataStore("settings", message.userId, message.data);
  console.log("Sending message on settings:client", result);
  event.sender.send("settings:client", result?.data);
};

const createSubscriber = {
  channel: "settings:add",
  callback: updateHandler,
};

export const subscribers = [getSubscriber, createSubscriber];
