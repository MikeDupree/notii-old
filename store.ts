import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { getSocket } from "./renderer/lib/SocketHandler";

type DataStoreEntry = {
  id: "string";
  [key: string]: unknown;
};

interface DataStore {
  name: string;
  owner: string;
  data: DataStoreEntry[];
}

export const updateDataStore = (
  storeName: string,
  userId: string,
  data: Record<string, unknown>
): void => {
  let response = {
    success: true,
    message: "Store sucess",
  };

  let storeFilePath = `${userId}.${storeName}.json`;
  let skipChecks = false;
  let updated = false;

  if (!data.id) {
    data.id = uuidv4();
    skipChecks = true;
  }

  let store = readStore(storeName, userId);
  if (!store) {
    console.log("Initializing store!");
    store = {
      name: storeName,
      owner: userId,
      data: [data],
    };
    skipChecks = true;
  }

  if (!skipChecks) {
    let existingData = {};
    const matchingData = store.data.filter(
      (entry: DataStoreEntry) => entry.id === data.id
    );

    if (matchingData.length) {
      // There should only ever be one entry.
      // Grab it here.
      existingData = matchingData.pop();
      for (const [i, entry] of store.data) {
        if (entry.id === data.id) {
          store.data[i] = {
            ...existingData,
            ...data,
          };
          updated = true;
        }
      }
    }
  }

  // Append new data if skipping checks or if we did check for existing DataStoreEntry
  // and didn't find anything.
  if (skipChecks || (!skipChecks && updated)) {
    store.data.push(data);
  }

      const socket = getSocket();
  fs.writeFile(storeFilePath, JSON.stringify(store), (err) => {
    if (err) {
      response = {
        success: false,
        message: err?.message,
      };
      socket.emit(`storeUpdate:${storeName}`, response);
    } else {
      console.log("File written successfully\n");
      response['data'] = readStore(storeName, userId);
      socket.emit(`storeUpdate:${storeName}`, response);
    }
  });

};

export const readStore = (storeName: string, userId: string) => {
  let data = null;
  try {
    data = fs.readFileSync(`${userId}.${storeName}.json`, {
      encoding: "utf8",
      flag: "r",
    });
  } catch (e) {
    console.log("=!= Store Read Error =!=");
    console.log(e);
    console.log("=i= Store Read Error =i=");
    return;
  }
  console.log("readStore::data", data);
  if (!data) {
    return;
  }
  return JSON.parse(data);
};

export default {
  get: readStore,
  update: updateDataStore,
};
