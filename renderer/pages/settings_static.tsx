import React from "react";
import Head from "next/head";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Menu from "../components/Menu";
import { useSession } from "next-auth/react";

import { SocialIcon } from "react-social-icons";
import { Button } from "@mui/material";

export default function Home({ test }) {
  const { data } = useSession();

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
            Settings
          </Typography>
        </Box>
      </Container>

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
            Material UI - Next.js example in TypeScript
          </Typography>
          <Link href="/about" color="secondary">
            Go to the about page
          </Link>
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
