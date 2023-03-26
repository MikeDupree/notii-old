import React from "react";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import Link from "next/link";

type Props = {
  user: string;
};

const Account = (props: Props) => {
  const { data } = useSession();
  console.log("yser", data);
  if (!data || !data.user) {
    return <>Error: you are not logged in</>;
  }
  return (
    <div>
      <Link href="/">Home</Link>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          {/* Recent Deposits */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                height: 240,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Avatar
                  src={data.user.image}
                  sx={{ width: 128, height: 128 }}
                />
                <Typography variant="body1">{data.user.name}</Typography>
                <Typography variant="body1">{data.user.email}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <TextField id="outlined-username-input" label="Username" />
              <TextField id="outlined-test-input" label="Username" />
              <TextField id="outlined-test-input" label="Username" />
              <Button variant="contained" color="success">
                Save
              </Button>
              <Button variant="contained" color="error">
                Delete
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              3
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Account;

export async function getServerSideProps(context) {
  return {
    props: {
      user: context.query.user,
    },
  };
}
