import { app, ipcMain, Menu } from "electron";
import serve from "electron-serve";

// removing socket.io and using ipc
import { createWindow } from "./helpers";
import { readStore, updateDataStore } from "../store";
import chalk from "chalk";
import { subscribers as todoSubscribers } from "../lib/modules/todo";

const testSubscribers = [
  {
    channel: "message",
    callback: (event, arg) => {
      console.log(`Received message from renderer process: ${arg}`);
      // Send a response back to the renderer process
      event.sender.send("message:client", "Hello from the main process!");
    },
  },
];

const subscribers = [...testSubscribers, ...todoSubscribers];

console.log(chalk.greenBright("=I= Server :: Init =I="));
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

console.log("defaultMenu native menu", defaultMenu);

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
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  log(":*:Starting application:*:");

  // Setup Window
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 1000,
  });
  if (isProd) {
    await mainWindow.loadURL("app://./index.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }

  // IPC Handlers
  // Register Event Subscribers;
  for (const subscriber of subscribers) {
    log(`Subscribing:, ${subscriber}`);
    ipcMain.on(subscriber.channel, subscriber.callback);
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
