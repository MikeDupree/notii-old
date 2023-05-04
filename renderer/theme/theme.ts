import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { useSettings } from "../hooks/settings";

// Create a theme instance.
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
});

export const getTheme = () => {
  const { settings } = useSettings();
  return createTheme({
    palette: {
      mode: settings?.darkMode ? "dark" : "light",
      primary: {
        main: "#556cd6",
      },
      secondary: {
        main: "#19857b",
      },
      error: {
        main: red.A400,
      },
    },
  });
};
