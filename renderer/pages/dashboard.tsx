import React from "react";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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
