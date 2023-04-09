import { app, ipcMain, Menu } from "electron";
import serve from "electron-serve";

// removing socket.io and using ipc
import { log } from "console";
import { createWindow } from "./helpers";
import { readStore, updateDataStore } from "../store";



log("=I= Server :: Init =I=");

const isProd: boolean = process.env.NODE_ENV === "production";
const defaultMenu = Menu.getApplicationMenu();

console.log("defaultMenu native menu", defaultMenu);

const customMenu = [
  {
    label: "Apps",
  },
];
const menu = Menu.buildFromTemplate(customMenu);
Menu.setApplicationMenu(menu);

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  console.log(":*:Starting application:*:");

  // Setup Window
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 1000,
  });
  if (isProd) {
    await mainWindow.loadURL("app://./index.html");
  } else {
    const port = process.argv[2];
    console.log("Server URL: ", port);
    await mainWindow.loadURL(`http://localhost:${port}/`);
    console.log("port", port);
    mainWindow.webContents.openDevTools();
  }

  // IPC Handlers
  // Listen for messages from the renderer process
  ipcMain.on("message", (event, arg) => {
    console.log(`Received message from renderer process: ${arg}`);

    // Send a response back to the renderer process
    event.sender.send("message:client", "Hello from the main process!");
  });

  // TODO build a plugin interface for registering ipc listeners

  // The TODO Plugin
  ipcMain.on("todo:get", (event, message) => {
    console.log("todo:get message:", message);
    if (!message.userId) {
      console.log("error: no user id passed to TODO listener");
      event.sender.send("error", {
        type: "storeGet",
        message: "missing userId",
        requestLogin: true,
      });
      return;
    }
    console.log("got userid");
    const todos = readStore("todo", message.userId);
    console.log("todos", todos);
    event.sender.send("todo:client", todos);
  });

  ipcMain.on("todo:add",async (event, message) => {
    console.log("test::message", message);
    console.log(typeof message);
    if (!message.userId) {
      console.log("error: no user id passed to TODO listener");
      event.sender.send("error", {
        type: "storeUpdate",
        message: "missing userId",
        requestLogin: true,
      });
      return;
    }
    console.log("got userid");
    const result = await updateDataStore("todo", message.userId, message);
    console.log('updateDataStore result:', result);
    event.sender.send('todo:client', result?.data);
  });

})();

app.on("window-all-closed", () => {
  app.quit();
});

