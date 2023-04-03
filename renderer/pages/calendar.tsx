import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";


export default function Calendar({ test }) {
  const [events, setEvents] = useState([]);
  const [failure, setFailure] = useState(false);

  useEffect(() => {
    axios
      .get("/api/calendar")
      .then((res) => {
        console.log("res", res.data);
        setEvents(res.data.events);
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
            Calendar
          </Typography>


          <Pagination count={10} size="small" />
        </Box>
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const userId = "mikerdupree@gmail.com";
  // const res = await axios.get(
  //   `https://gmail.googleapis.com/gmail/v1/users/${userId}/events`
  // );
  // console.log("res", res);

  return {
    props: {
      test: "This is a test",
    },
  };
}
