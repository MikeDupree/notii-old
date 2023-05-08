import React, { useEffect, useState } from "react";
import Radio from "./components/Radio";
import { useSession } from "next-auth/react";
import { ipcHandler } from "../../../renderer/src/ipc";
import { ipcRenderer } from "electron";
import { CircularProgress, Typography } from "@mui/material";

type Props = {};
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

const renderer = (props: Props) => {
  const [options, setOptions] = useState<Record<string, string | boolean>>();
  const settings = [...defaultSettings];
  const session = useSession();
  const socket = ipcHandler("settings");

  const handleSettingsUpdate = (event, message) => {
    console.log(`SETTINGS socket message`);
    console.log(message);
    if (message && message.data) {
      console.log("set config", message.data);
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
    console.log(change);
    // todo fix this. setup store for settings'
    setOptions({ ...options, ...change });

    console.log("Updating settings config");
    socket.send(
      { userId: session?.data?.user?.sub, data: { ...options, ...change } },
      { channelOverride: "settings:add" }
    );

    socket.send(
      { value: "Handle dat change!" },
      { channelOverride: "alerts:client" }
    );
  };

  useEffect(() => {
    // Load settings.
  }, []);

  const getRadioItemValue = (fieldName: string): boolean => {
    return !!options?.[fieldName];
  };

  if (!options) {
    return <CircularProgress />;
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
    </div>
  );
};

export default renderer;
