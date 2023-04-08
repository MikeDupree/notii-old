import fs from "fs";

/**
 * Update Store
 *
 * @params: data - The data to store
 * @example ```
 * updateStore({name: 'John Doe'});
 * ```
 * @returns: response
 * @example ```
 * {
 *   sucess: true,
 *   message: "Success"
 * }```
 */
export const updateStore = (
  authType: string,
  userId: string,
  data: Record<string, string>
): { sucess: boolean; message: string } => {
  let response = {
    sucess: true,
    message: "Store sucess",
  };

  let store = readStore("session", userId);
  if (!store) {
    console.log("Initializing store!");
    store = {};
  }
  if (!store[authType]) {
    store[authType] = [];
  }

  console.log("Existing Auth Types", store);
  let existingData = {};
  const matchingData = store[authType].filter(
    (account) => account.id === userId
  );
  if (matchingData.length) {
    // There should only ever be one account.
    // Grab it here.
    existingData = matchingData.pop();
    for (const [i, account] of store[authType]) {
      if (account.id === userId) {
        store[authType][i] = {
          ...existingData,
          ...data,
          id: userId,
        };
      }
    }
  } else {
    store[authType].push({
      id: userId,
      ...data,
    });
  }

  fs.writeFile("store.json", JSON.stringify(store), (err) => {
    if (err) {
      response = {
        sucess: false,
        message: err?.message,
      };
    } else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("store.json", "utf8"));
    }
  });

  return response;
};

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
): { success: boolean; message: string } => {
  let response = {
    success: true,
    message: "Store sucess",
  };

  let storeFilePath = `${userId}.${storeName}.json`;
  let skipChecks = false;
  let updated = false;

  if (!data.id) {
    data.id = crypto.randomUUID();
    skipChecks = true;
  }

  let store = readStore(storeName, userId);
  if (!store) {
    console.log("Initializing store!");
    store = {
      name: storeName,
      owner: userId,
      data: data,
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

  fs.writeFile(storeFilePath, JSON.stringify(store), (err) => {
    if (err) {
      response = {
        success: false,
        message: err?.message,
      };
    } else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("store.json", "utf8"));
    }
  });

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
  return JSON.parse(data);
};

export default {
  get: readStore,
  update: updateStore,
};
