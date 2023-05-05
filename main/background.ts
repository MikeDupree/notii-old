import { app, ipcMain, Menu } from "electron";
import serve from "electron-serve";
import fs from "fs";
import chalk from "chalk";
import { createWindow } from "./helpers";
import axios from "axios";

let moduleConfigs = [];

const defaultSubscribers = [
  {
    channel: "message",
    callback: (event, arg) => {
      console.log(`Received message from renderer process: ${arg}`);
      // Send a response back to the renderer process
      event.sender.send("message:client", "Hello from the main process!");
    },
  },
  {
    channel: "modules",
    callback: (event, arg) => {
      console.log(`Received message from renderer process: ${arg}`);
      // Send a response back to the renderer process
      event.sender.send("modules:client", moduleConfigs);
    },
  },
];

let subscribers = [...defaultSubscribers];

// TODO determine a good modules location
// and update this to load a path based on
// OS and load from there.
/*
 * Load modules
 */
const modulesLocation = "./lib/modules";
const modulePaths = fs.readdirSync(modulesLocation);
const loadModules = async () => {
  for (const modulePath of modulePaths) {
    console.log("module path", modulePath);
    let module = await import(`../lib/modules/${modulePath}`);
    console.log("module", module);
    console.log("config", module?.config);
    if (!module.config) {
      continue;
    }

    // Handle module subscribers
    if (module?.subscribers?.length > 0) {
      subscribers = [...subscribers, ...module?.subscribers];
    }
    moduleConfigs = [...moduleConfigs, module?.config];
  }
};

/**
 * Logging
 */
const log = (
  message: unknown,
  type = "msg",
  options = {
    toString: false,
  }
) => {
  let color = chalk.grey;
  switch (type) {
    case "err":
      color = chalk.red;
    case "info":
      color = chalk.yellow;
  }
  console.log(color(message));
  if (!options.toString) {
    return;
  }
  return color(message);
};

const isProd: boolean = process.env.NODE_ENV === "production";
const defaultMenu = Menu.getApplicationMenu();

// const customMenu = [
//   {
//     label: "Apps",
//   },
// ];
// const menu = Menu.buildFromTemplate(customMenu);
// Menu.setApplicationMenu(menu);

if (isProd) {
  serve({ directory: "app" });
} else {
  log("Running development mode.", "info");
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await loadModules();
  await app.whenReady();

  log(":*:Starting application:*:");

  axios
    .get("http://localhost:8080/files?path=/home/mdupree")
    .then((res) => {
      console.log(res.data);
    })
    .catch((e) => {
      console.log(e);
    });
  // Setup Window
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 1000,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./index.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools();
    mainWindow.showInactive();
  }

  // IPC Handlers
  // Register Event Subscribers;
  for (const subscriber of subscribers) {
    log(subscriber, "info");
    log(`Subscribing:, ${subscriber?.channel}`, "info");
    ipcMain.on(subscriber.channel, subscriber.callback);
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
