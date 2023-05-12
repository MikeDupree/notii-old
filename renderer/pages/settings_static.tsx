import React from "react";
import Head from "next/head";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Menu from "../components/Menu";
import { useSession } from "next-auth/react";

import { SocialIcon } from "react-social-icons";
import { Button } from "@mui/material";

export default function Home({ test }) {
  const { data } = useSession();
  const mode = "light";

  const [debugMode, setDebugMode] = useState(false);

  function toggleDebugMode() {
    setDebugMode((prevState) => !prevState);
  }

  function handleDarkModeChange() {
  }

  return (
    <>
   
      <Container maxWidth="lg">
        <Box sx={{ p: 6 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Settings
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1">Dark mode</Typography>
            <Switch
              checked={mode === "dark"}
              onChange={handleDarkModeChange}
              color="primary"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 4,
            }}
          >
            <Typography variant="body1">Debug mode</Typography>
            <Switch
              checked={debugMode}
              onChange={toggleDebugMode}
              color="primary"
            />
          </Box>
        </Box>
      </Container>
    </>
  );
}

function Settings() {
  const [debugMode, setDebugMode] = useState(false);
  const { mode, toggleTheme } = useTheme();

  function toggleDebugMode() {
    setDebugMode((prevState) => !prevState);
  }

  function handleDarkModeChange() {
    toggleTheme();
  }

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body1">Dark mode</Typography>
        <Switch
          checked={mode === "dark"}
          onChange={handleDarkModeChange}
          color="primary"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 4,
        }}
      >
        <Typography variant="body1">Debug mode</Typography>
        <Switch
          checked={debugMode}
          onChange={toggleDebugMode}
          color="primary"
        />
      </Box>
    </Box>
  );
}
