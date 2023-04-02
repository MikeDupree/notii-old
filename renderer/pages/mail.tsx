import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Pagination from "@mui/material/Pagination";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { google } from "googleapis";
import axios from "axios";
// import { getSession } from "next-auth/client"
import { ThreeDBox } from "../components/3DBox";

import { MailList } from "../components/Mail";

export default function Mail({ test }) {
  const [messages, setMessages] = useState([]);
  const [failure, setFailure] = useState(false);

  useEffect(() => {
    axios
      .get("/api/mail")
      .then((res) => {
        console.log("res", res);
        setMessages(res.data.messages);
      })
      .catch((err) => {
        setFailure(true);
      });
  }, []);

  if (failure) {
    return <p> Failed to load</p>;
  }

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
            Mail
          </Typography>

          {messages.length === 0 && <b>Loading...</b>}

          <MailList messages={messages} />
          <Pagination count={10} size="small" />
        </Box>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const userId = "mikerdupree@gmail.com";
  // const res = await axios.get(
  //   `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages`
  // );
  // console.log("res", res);

  return {
    props: {
      test: "This is a test",
    },
  };
}
