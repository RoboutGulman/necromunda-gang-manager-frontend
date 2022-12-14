import { Box, Link, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  boxWithText: {
    background: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
  },
  linkBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

export default function NotFoundPage() {
  const classes = useStyles();

  return (
    <Box className={classes.boxWithText}>
      <Typography
        align="center"
        sx={{ fontWeight: "600" }}
        variant="h3"
        color="secondary"
        gutterBottom>
        PAGE NOT FOUND
      </Typography>
      <Box className={classes.linkBox}>
        <Link
          color="secondary"
          variant="h6"
          component={RouterLink}
          to="/"
          gutterBottom>
          Return to home
        </Link>
      </Box>
    </Box>
  );
}
