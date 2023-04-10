import { ipcMain } from "electron";
import fs from "fs";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

type DataStoreEntry = {
  id: "string";
  [key: string]: unknown;
};

interface DataStore {
  name: string;
  owner: string;
  data: DataStoreEntry[];
}

export const updateDataStore = async (
  storeName: string,
  userId: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; message: string; data: unknown }> => {
  let response = {
    success: true,
    message: "Store sucess",
    data: null,
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

  const writer = promisify(fs.writeFile);
  const result = await writer(storeFilePath, JSON.stringify(store));
  console.log('write result', result);
  // (err) => {
  //   if (err) {
  //     response = {
  //       success: false,
  //       message: err?.message,
  //     };
  //     ipcMain.emit(`${storeName}:client`, response);
  //   } else {
  //     console.log("File written successfully\n");
  //     console.log("response", response);
  //     console.log("send on channel: ", `${storeName}:client`);
  //     ipcMain.emit(`${storeName}:client`, response);
  //   }
  // }

  response.data = store;
  return response;
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
  if (!data) {
    return;
  }
  return JSON.parse(data);
};

export default {
  get: readStore,
  update: updateDataStore,
};
