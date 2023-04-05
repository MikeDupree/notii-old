import { match } from "assert";
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

  let store = readStore();
  if (!store) {
    console.log("Initializing store!");
    store = {};
  }
  if (!store[authType]) {
    store[authType] = [];
  }

  console.log("Existing Auth Types", store);
  let accountData = {};
  const matchingAccount = store[authType].filter(
    (account) => account.id === userId
  );
  if (matchingAccount.length) {
    // There should only ever be one account.
    // Grab it here.
    accountData = matchingAccount.pop();
    for (const [i, account] of store[authType]) {
      if (account.id === userId) {
        store[authType][i] = {
          ...accountData,
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

export const readStore = () => {
  let data = null;
  try {
    data = fs.readFileSync("store.json", { encoding: "utf8", flag: "r" });
  } catch (e) {
    console.log("=== Store Read Error ===");
    console.log(e);
  }
  return JSON.parse(data);
};

export default {
  get: readStore,
  update: updateStore
}
