import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import FolderIcon from "@mui/icons-material/Folder";

import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { getSocket } from "../lib/SocketHandler";
import { useSession } from "next-auth/react";

export default function Home({ test }) {
  const [todos, setTodos] = useState([]);
  const [socket, setSocket] = useState(getSocket());
  const session = useSession();

  const handleTodoUpdate = (message) => {
    console.log(`TODO socket message`);
    console.log(message);
    if (message && message.data) {
      setTodos(message.data);
    }
  };

  useEffect(() => {
    //request todo data for user.
    socket.on("todo", handleTodoUpdate);

    // emit this when first mounting to get current todos
    socket.emit("todo:get", { userId: session?.data?.user?.sub });

    return () => {
      socket.off("todo", handleTodoUpdate);
    };
  }, [socket]);

  console.log(session);
  // Listen for messages from the server

  const add = (e) => {
    console.log(e.target.value);
    console.log(e.key);
    console.log(new Date().getTime());
    if (e.key === "Enter") {
      socket.emit("todo:add", {
        type: "todo",
        timestamp: new Date().getTime(),
        value: e.target.value,
        completed: false,
        userId: session?.data?.user?.sub,
        email: session.data?.user?.email,
      });
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
