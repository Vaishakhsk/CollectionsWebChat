import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
  Avatar,
  ListItemAvatar,
  InputBase,
  Paper,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";

const CustomerList = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  loading,
}) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getRandomColor = (name) => {
    const colors = ["#183fa7", "#075E54", "#25D366", "#34B7F1", "#ECE5DD"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#128C7E" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          m: 1,
          backgroundColor: alpha("#000", 0.03),
          "&:hover": {
            backgroundColor: alpha("#000", 0.05),
          },
        }}
      >
        <IconButton sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search customers" />
      </Paper>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <List sx={{ padding: 0 }}>
          {customers.map((customer, index) => (
            <React.Fragment key={customer.id}>
              <ListItemButton
                selected={selectedCustomer?.id === customer.id}
                onClick={() => onSelectCustomer(customer)}
                sx={{
                  py: 1.5,
                  "&.Mui-selected": {
                    backgroundColor: alpha("#128C7E", 0.08),
                    "&:hover": {
                      backgroundColor: alpha("#128C7E", 0.12),
                    },
                  },
                  "&:hover": {
                    backgroundColor: alpha("#000", 0.04),
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: getRandomColor(customer.name),
                      width: 45,
                      height: 45,
                      fontSize: "1.2rem",
                      fontFamily: "Poppins",
                    }}
                  >
                    {getInitials(customer.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 500, color: "#1a1a1a" }}>
                      {customer.name}
                    </Typography>
                  }
                  secondary={
                    <Box
                      sx={{ display: "flex", flexDirection: "column", mt: 0.5 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {customer.bank}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#128C7E",
                          fontWeight: 500,
                        }}
                      >
                        EMI Due: ₹{customer.amount}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
              {index < customers.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default CustomerList;
