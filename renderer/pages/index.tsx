import React from "react";
import { Canvas } from "@react-three/fiber";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { google } from "googleapis";
import axios from "axios";
// import { getSession } from "next-auth/client"
import { ThreeDBox } from '../components/3DBox';

export default function Home({ test }) {
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
            Notii
          </Typography>

      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <ThreeDBox position={[-1.2, 0, 0]} />
        <ThreeDBox position={[1.2, 0, 0]} />
      </Canvas>

          <iframe src="https://mail.google.com/" />
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
