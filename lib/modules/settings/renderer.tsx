import React, { useEffect, useState } from "react";
import Radio from "./components/Radio";
import { useSession } from "next-auth/react";
import { ipcHandler } from "../../../renderer/src/ipc";
import { ipcRenderer } from "electron";
import { CircularProgress, Typography } from "@mui/material";
import { Module, useModules } from "../../../renderer/hooks/modules";

type Props = {
  modules?: Module[];
};

type ConfigItem = {
  label: string;
  fieldName?: string;
  value: boolean | string;
};

const defaultSettings: ConfigItem[] = [
  {
    label: "Developer Mode",
    fieldName: "devMode",
    value: false,
  },

  {
    label: "Dark Mode",
    fieldName: "darkMode",
    value: false,
  },
];

type Settings = {
  darkMode: boolean;
  devMode: boolean;
  modules: Record<string, boolean>;
  [key: string]: unknown;
};

const renderer = ({ modules }: Props) => {
  console.log("Settings Renderer Props", modules);
  const [options, setOptions] = useState<Settings>();
  const settings = [...defaultSettings];
  const session = useSession();
  const socket = ipcHandler("settings");

  const handleSettingsUpdate = (event, message) => {
    if (message && message.data) {
      // TODO After store data array only fix.
      setOptions(message.data?.[0]); // This is cause the store is setup to store data in array... Cant remember why. Fix it.
    }
  };
  ipcRenderer.addListener("settings:client", handleSettingsUpdate);

  useEffect(() => {
    //request todo data for user.
    // emit this when first mounting to get current todos
    socket.send(
      { userId: session?.data?.user?.sub },
      { channelOverride: "settings:get" }
    );

    return () => {
      // ipcRenderer.removeListener("todo:client", handleSettingsUpdate);
    };
  }, []);
  console.log("opts", options);
  // Add more config here...

  const handleChange = (change) => {
    setOptions({ ...options, ...change });

    socket.send(
      { userId: session?.data?.user?.sub, data: { ...options, ...change } },
      { channelOverride: "settings:add" }
    );
  };

  const handleModuleChange = (module: Record<string, boolean>) => {
    console.log("handleModuleChange", module);
    options.modules = { ...options.modules, ...module };
    setOptions({ ...options });
    socket.send(
      { userId: session?.data?.user?.sub, data: options },
      { channelOverride: "settings:add" }
    );
  };

  const getRadioItemValue = (
    fieldName: string,
    isModule?: boolean
  ): boolean => {
    if (isModule) {
      return !!options?.modules?.[fieldName];
    }
    return !!options?.[fieldName];
  };

  if (!options) {
    return (
      <>
        <Typography variant="h3">Loading options...</Typography>
        <CircularProgress />
      </>
    );
  }

  return (
    <div>
      <Typography variant="h1">Settings</Typography>
      {settings.map(({ label, fieldName, value }) => (
        <Radio
          label={label}
          fieldName={fieldName || label.toLowerCase().replaceAll(" ", "_")}
          value={getRadioItemValue(
            fieldName || label.toLowerCase().replaceAll(" ", "_")
          )}
          onChange={handleChange}
        />
      ))}

      <Typography variant="h3">Modules</Typography>
      {modules.length > 0 &&
        modules.map((module) => (
          <Radio
            label={module.name}
            fieldName={module.name.toLowerCase()}
            disabled={module.name.toLowerCase() === "settings"}
            value={getRadioItemValue(module.name.toLowerCase(), true)}
            onChange={handleModuleChange}
          />
        ))}
    </div>
  );
};

export default renderer;
