import { ipcRenderer } from "electron";

export const ipcHandler = (channel: string) => {
  const sendMessage = (message: unknown, config?: {channelOverride?:string}) => {
    let sendChannel = channel;
    if(config?.channelOverride){
      sendChannel = config.channelOverride;
    }
    console.log('sending on channel:', sendChannel);
    try{
      ipcRenderer.send(sendChannel, message);
    } catch(e){
      console.log('Error sending ipc message for', sendChannel);
      console.log('error::', e);
    }
  }

  const register = (callback: (event, arg) => void) => { 
    ipcRenderer.on(`${channel}:client`, callback);
  }

  const unregister = (callback) => {
    ipcRenderer.removeListener(`${channel}:client`, callback);
  }
  return { send: sendMessage, register, unregister };
}
