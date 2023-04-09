import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";

import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";

import { ipcHandler } from "../src/ipc";
import { ipcRenderer } from "electron";

export default function Home({ test }) {
  const [todos, setTodos] = useState([]);
  const session = useSession();
  const socket = ipcHandler("todo");
  const handleTodoUpdate = (event, message) => {
    console.log(`TODO socket message`);
    console.log(message);
    if (message && message.data) {
      setTodos(message.data);
    }
  };
  ipcRenderer.addListener("todo:client", handleTodoUpdate);

  useEffect(() => {
    //request todo data for user.

    // emit this when first mounting to get current todos
    socket.send(
      { userId: session?.data?.user?.sub },
      { channelOverride: "todo:get" }
    );

    return () => {
      // ipcRenderer.removeListener("todo:client", handleTodoUpdate);
    };
  }, []);

  console.log(session);
  // Listen for messages from the server

  const add = (e) => {
    if (e.key === "Enter") {
      console.log("sending message");
      socket.send(
        {
          type: "todo",
          timestamp: new Date().getTime(),
          value: e.target.value,
          completed: false,
          userId: session?.data?.user?.sub,
          email: session.data?.user?.email,
        },
        { channelOverride: "todo:add" }
      );
    }
    // axios.post("/api/updateDataStore").then(() => console.log("success!"));
    // Send a message to the server
  };
  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Tasks
          </Typography>
        </Box>
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="New Task"
            variant="outlined"
            onKeyPress={add}
          />
          <Button onClick={add}>+ Add</Button>
        </Box>

        <Box>
          <List dense={false}>
            {todos.map((todo) => (
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Checkbox />
                <ListItemText primary={todo.value} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      test: "This is a test",
    },
  };
}
