import React from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

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
          <TextField id="outlined-basic" label="New Task" variant="outlined" />
          <Button>+ Add</Button>
        </Box>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  console.log("get serverside", context);
  return {
    props: {
      test: "This is a test",
    },
  };
}
