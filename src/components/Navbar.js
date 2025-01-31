import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontFamily: "Poppins" }}
          >
            Hi Vaishakh
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
