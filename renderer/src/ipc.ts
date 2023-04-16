import { ipcRenderer } from "electron";

export const ipcHandler = (channel: string) => {
  const sendMessage = (message: unknown, config?: {channelOverride?:string}) => {
    let sendChannel = channel;
    if(config?.channelOverride){
      sendChannel = config.channelOverride;
    }
    console.log('sending on channel:', sendChannel);
    ipcRenderer.send(sendChannel, message);
  }

  const register = (callback: (event, arg) => void) => { 
    ipcRenderer.on(`${channel}:client`, callback);
  }

  const unregister = (callback) => {
    ipcRenderer.removeListener(`${channel}:client`, callback);
  }
  return { send: sendMessage, register, unregister };
}
