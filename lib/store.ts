import { log } from "console";
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
  let isNewStore = false;
  let isNewEntry = false;
  let updated = false;

  if (!data.id) {
    data.id = uuidv4();
    isNewEntry = true;
  }

  let store = readStore(storeName, userId);
  if (!store) {
    store = {
      name: storeName,
      owner: userId,
      data: [data],
    };
    isNewEntry = true;
    isNewStore = true;
  }

  if (!isNewEntry) {
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
          if (config?.force) {
            store.data[i] = data;
            return;
          }
          store.data[i] = {
            ...existingData,
            ...data,
          };
        }
      }
    }
  }

  // If this is not a new store, but is a new entry, and doesnt update an existing entry.
  if (!isNewStore && isNewEntry && !updated) {
    store.data.push(data);
  }

  const writer = promisify(fs.writeFile);
  const result = await writer(
    `${getStorePath()}/${storeFilePath}`,
    JSON.stringify(store)
  );

  response.data = store;
  return response;
};

export const overwriteDataStore = async (
  storeName: string,
  userId: string,
  store: Record<string, unknown>
): Promise<{ success: boolean; message: string; data: unknown }> => {
  let response = {
    success: true,
    message: "Store sucess",
    data: null,
  };

  let storeFilePath = `${userId}.${storeName}.json`;

  const writer = promisify(fs.writeFile);
  await writer(`${getStorePath()}/${storeFilePath}`, JSON.stringify(store));

  response.data = store;
  return response;
};

/**
 * Read Store
 *
 * @param (string) storename
 */
export const readStore = (
  storeName: string,
  userId: string,
  options?: { initData: Record<string, unknown> }
) => {
  let data = null;
  if (!storeName || !userId) {
    return;
  }
  try {
    data = fs.readFileSync(`${getStorePath()}/${userId}.${storeName}.json`, {
      encoding: "utf8",
      flag: "r",
    });
    return JSON.parse(data);
  } catch (e) {
    if (options && options.initData) {
      console.log('readStore: options', options);
      updateDataStore(storeName, userId, options.initData);
    }
    return;
  }
};

export default {
  get: readStore,
  update: updateDataStore,
};
