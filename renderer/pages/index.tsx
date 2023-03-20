import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '../components/Menu';
import { useSession } from 'next-auth/react';

import { SocialIcon } from 'react-social-icons';
import { Button } from '@mui/material';


export default function Home({ test }) {
  const { data } = useSession();

  if (!data) {
    // No user logged in.
    return (

      <>
        <Head>
          <title>Notii</title>
        </Head>

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
              Please login to get started
            </Typography>
            <Link href="/api/auth/signin/github" color="secondary" style={{}}>
              <Button variant='contained' color='secondary'>

                <SocialIcon bgColor='#19857b' fgColor='white' url='https://github.com' onClick={(e) => e.preventDefault()} />
                <Typography variant='h5'>Login</Typography>
              </Button>
            </Link>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Notii {test}</title>
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
          </Typography>
          <Link href="/api/auth/signin/github" color="secondary">
            Login
          </Link>
        </Box>
      </Container>

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

export async function getServerSideProps(context) {

  console.log('get serverside', context);
  return {
    props: {
      test: 'This is a test'
    },
  }
}
