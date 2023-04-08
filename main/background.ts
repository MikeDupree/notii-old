import { app, Menu } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import http from "http";
import { Server } from "socket.io";
import { log } from "console";

const server = http.createServer();
const io = new Server(server);
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

  if (isProd) {
    await mainWindow.loadURL("app://./index.html");
  } else {
    const port = process.argv[2];
    console.log("Server URL: ", port);
    await mainWindow.loadURL(`http://localhost:${port}/`);
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
});

io.listen(8888);
