import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

type Props = {};

const Loading = (props: Props) => {
  return (
    <Box
    sx={{ marginTop: '35px', display: "flex", justifyContent: "center", justifyItems: "center" }}
    >
      <CircularProgress
        color="secondary"
      />
    </Box>
  );
};

export default Loading;
