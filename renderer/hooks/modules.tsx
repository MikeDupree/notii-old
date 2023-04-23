import { useEffect, useState, createContext } from "react";
import { ipcHandler } from "../src/ipc";
import { ipcRenderer } from "electron";

export interface Module {
  name: string;
  url: string;
  renderer: string;
}

const ModulesContext = createContext<Module[]>([]);

export const useModules = (): {
  modules: Module[];
} => {
  const [modules, setModules] = useState<Module[]>([]);

  const socket = ipcHandler("modules");
  const handleGetModules = (event, message) => {
    setModules(message);
  };

  if (ipcRenderer) {
    console.log("addListener :: modules");
    ipcRenderer.addListener("modules:client", handleGetModules);
  }

  useEffect(() => {
    //request todo data for user.
    // emit this when first mounting to get current todos
    socket.send({ channelOverride: "modules" });

    return () => {
      // ipcRenderer.removeListener("todo:client", handleTodoUpdate);
    };
  }, []);

  return {
    modules,
  };
};

export const ModulesProvider = ({ children }) => {
  return (
    <ModulesContext.Provider value={[]}>{children}</ModulesContext.Provider>
  );
};
