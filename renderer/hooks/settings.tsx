import { useEffect, useState, createContext } from "react";
import { ipcHandler } from "../src/ipc";
import { ipcRenderer } from "electron";
import { useSession } from "next-auth/react";

export interface Settings {
  darkMode: boolean;
  devMode: boolean;
  modules: Record<string, boolean>
}

const SettingsContext = createContext<Settings>(null);

export const useSettings = (): {
  settings: Settings;
} => {
  const session = useSession();
  const [settings, setSettings] = useState<Settings>();

  const socket = ipcHandler("settings");
  const handleGetSettings = (event, message) => {
    setSettings(message.data?.[0]);
  };

  if (ipcRenderer) {
    ipcRenderer.addListener("settings:client", handleGetSettings);
  }

  useEffect(() => {
    //request todo data for user.
    // emit this when first mounting to get current todos
    if (!session) return;
    socket.send(
      { userId: session?.data?.user?.sub },
      { channelOverride: "settings:get" }
    );

    return () => {
      // ipcRenderer.removeListener("todo:client", handleTodoUpdate);
    };
  }, [session]);

  return {
    settings,
  };
};

export const SettingsProvider = ({ children }) => {
  return (
    <SettingsContext.Provider value={null}>{children}</SettingsContext.Provider>
  );
};
