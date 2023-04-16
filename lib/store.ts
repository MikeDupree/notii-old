import fs from "fs";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

const getStorePath = () => {
  //TODO read OS type and determine path to store.
  // IE: Linux = ~/.config/notii/store
  return "./store";
};

export type DataStoreEntry = {
  id: "string";
  [key: string]: unknown;
};

export interface DataStore {
  name: string;
  owner: string;
  data: DataStoreEntry[];
}

export const updateDataStore = async (
  storeName: string,
  userId: string,
  data: Record<string, unknown>,
  config?: { force: boolean }
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
          updated = true;
          console.log("update data", data);
          if (config?.force) {
            console.log("Overwrite existingData");
            store.data[i] = data;
            return;
          }
          console.log("Merge existingData");
          store.data[i] = {
            ...existingData,
            ...data,
          };
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
  const result = await writer(
    `${getStorePath()}/${storeFilePath}`,
    JSON.stringify(store)
  );
  console.log("write result", result);
  // (err) =>
  response.data = store;
  return response;
};

export const readStore = (storeName: string, userId: string) => {
  let data = null;
  if (!storeName || !userId) {
    return;
  }
  try {
    data = fs.readFileSync(`${getStorePath()}/${userId}.${storeName}.json`, {
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
