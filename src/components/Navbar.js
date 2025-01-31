import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const Navbar = ({ onNewChat }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setPhoneNumber("");
    setError("");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleCreateChat = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    const formattedPhone = `+91${phoneNumber}`;
    onNewChat({
      id: Date.now(),
      name: formattedPhone,
      phone: formattedPhone,
      amount: "0.00",
      month: "",
      dueDate: "",
      bank: "",
    });
    handleCloseDialog();
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#128C7E" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 500,
              }}
            >
              Dhanam
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={handleOpenDialog}>
              <AddIcon />
            </IconButton>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <Avatar
              sx={{
                bgcolor: "#075E54",
                width: 40,
                height: 40,
                fontFamily: "Poppins",
                fontWeight: 500,
              }}
            >
              {getInitials("Vaishakh")}
            </Avatar>
            <IconButton color="inherit">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontFamily: "Poppins" }}>New Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setPhoneNumber(value);
              setError("");
            }}
            placeholder="10-digit mobile number"
            error={!!error}
            helperText={error}
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <span style={{ color: "rgba(0, 0, 0, 0.54)" }}>+91 </span>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleCreateChat}
            variant="contained"
            color="primary"
          >
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
