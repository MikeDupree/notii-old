import { app, Menu } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import http from "http";
import { Server } from "socket.io";
import { log } from "console";
import { readStore, updateDataStore } from "../store";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8888", // Change this to the client's origin
    methods: ["GET", "POST"],
  },
});

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

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
  });

  console.log("test");

  if (isProd) {
    await mainWindow.loadURL("app://./index.html");
  } else {
    const port = process.argv[2];
    console.log("Server URL: ", port);
    await mainWindow.loadURL(`http://localhost:${port}/`);
    console.log("port", port);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

//
// Socket Handler
//
io.on("connection", (socket) => {
  console.log("A user connected.");

  // Send a message to the client
  socket.emit("message", "Hello from the server!");

  // Listen for messages from the client
  socket.on("message", (message) => {
    console.log(`Received message from client: ${message}`);
  });

  socket.on("todo:get", (message) => {
    console.log("test::message", message);
    if (!message.userId) {
      console.log("error: no user id passed to TODO listener");
      socket.emit("error", {
        type: "storeGet",
        message: "missing userId",
        requestLogin: true,
      });
      return;
    }
    console.log("got userid");
    const todos = readStore("todo", message.userId);
    console.log("todos", todos);
    socket.emit("todo", todos);
  });
  socket.on("storeUpdate:todo", (message) => {
    console.log("storeUpdate:todo message", message);
    if (message.success) {
      console.log('emit todos');
      socket.emit("todo", message.data);
    }
  });
  socket.on("todo:add", (message) => {
    console.log("test::message", message);
    console.log(typeof message);
    if (!message.userId) {
      console.log("error: no user id passed to TODO listener");
      socket.emit("error", {
        type: "storeUpdate",
        message: "missing userId",
        requestLogin: true,
      });
      return;
    }
    console.log("got userid");
    updateDataStore("todo", message.userId, message);
  });
});
// server.listen(8989, () => {
//   console.log(`Server listening on port 8888.`);
// });
io.listen(8989);
