import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '../components/Menu';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <Menu />
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
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

