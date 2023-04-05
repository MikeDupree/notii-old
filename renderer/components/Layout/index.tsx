import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import Menu from "../Menu";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Container, Box, Button, Breadcrumbs, Typography } from "@mui/material";

type Props = { children: ReactNode };

const Layout = ({ children }: Props) => {
  const { data } = useSession();
  const router = useRouter();

  let breadcrumbs = router.route.split("/");
  if (router.route === "/") {
    breadcrumbs = [""];
  }

  if (!data) {
    // No user logged in.
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
              Please login to get started
            </Typography>
            <Link href="/api/auth/signin/github" color="secondary" style={{}}>
              <Button variant="contained" color="secondary">
                Login
              </Button>
            </Link>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <div className="p-6">
      <Head>
        <title>Notii</title>
      </Head>
      <Menu />

      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.length > 1 &&
          breadcrumbs.slice(0, breadcrumbs.length - 1).map((breadcrumb) => (
            <Link color="inherit" href={`/${breadcrumb}`}>
              <div className="text-slate-500 font-medium hover:text-slate-100">
                {breadcrumb == "" ? "Home" : breadcrumb}
              </div>
            </Link>
          ))}
        <Typography color="text.primary">{breadcrumbs.pop()}</Typography>
      </Breadcrumbs>

      {children}
    </div>
  );
};

export default Layout;
