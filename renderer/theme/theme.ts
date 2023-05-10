import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { useSettings } from "../hooks/settings";

export const getTheme = () => {
  const { settings } = useSettings();
  return createTheme({
    palette: {
      mode: settings?.darkMode ? "dark" : "light",
      primary: {
        main: "#ffffff",
      },
      secondary: {
        light: "#0066ff",
        main: "#0044ff",
        contrastText: "#ffcc00",
      },
      error: {
        main: red.A400,
      },
    },
    typography: {
      h1:{
        fontSize: '2.2rem'
      },
      h2:{
        fontSize: '1.8rem'
      },
      h3:{
        fontSize: '1.6rem'
      },
      h4:{
        fontSize: '1.4rem'
      },
      h5:{
        fontSize: '1.2rem'
      },
    }
  });
};
