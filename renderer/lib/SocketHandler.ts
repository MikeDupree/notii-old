import { ipcRenderer } from "electron";
import io from "socket.io-client";

export const getSocket = () => {
  return io("http://localhost:8989");
};

// class IpcHandler {
//   private ipc;
//   private channel: string;
//
//   constructor(channel: string) {
//     this.ipc = ipcRenderer;
//     this.channel = channel;
//   }
//
//   /**
//    * send
//    */
//   public send(message: unknown) {
//     ipcRenderer.send(this.channel, message);
//   }
//
//   public register(callback: (event, arg) => void) { 
//     ipcRenderer.on(`${this.channel}:client`, callback);
//   }
// }
//


