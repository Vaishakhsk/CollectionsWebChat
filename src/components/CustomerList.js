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
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { alpha, styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const StyledInputBase = styled(InputBase)({
  "& .MuiInputBase-input": {
    fontFamily: "Poppins, sans-serif",
  },
});

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
        backgroundColor: "#f8f9fa",
        borderRight: "1px solid",
        borderColor: "divider",
        boxShadow: "inset -1px 0 0 rgba(0, 0, 0, 0.1)",
        fontFamily: "Poppins, sans-serif",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          backgroundColor: "white",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "#128C7E",
            fontSize: "1.1rem",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Chats
        </Typography>
        <Paper
          elevation={0}
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            backgroundColor: alpha("#000", 0.03),
            borderRadius: 2,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: alpha("#000", 0.05),
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="search">
            <SearchIcon sx={{ color: alpha("#000", 0.54) }} />
          </IconButton>
          <StyledInputBase
            sx={{
              ml: 1,
              flex: 1,
              "& input": {
                padding: "8px 0",
                fontSize: "0.95rem",
              },
            }}
            placeholder="Search customers"
          />
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <List sx={{ padding: "8px 0" }}>
          {customers.map((customer, index) => (
            <React.Fragment key={customer.id}>
              <ListItemButton
                selected={selectedCustomer?.id === customer.id}
                onClick={() => onSelectCustomer(customer)}
                sx={{
                  py: 1.5,
                  px: 2,
                  transition: "all 0.2s ease-in-out",
                  "&.Mui-selected": {
                    backgroundColor: alpha("#128C7E", 0.08),
                    "&:hover": {
                      backgroundColor: alpha("#128C7E", 0.12),
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      backgroundColor: "#128C7E",
                      borderRadius: "0 4px 4px 0",
                    },
                  },
                  "&:hover": {
                    backgroundColor: alpha("#000", 0.04),
                    transform: "translateX(4px)",
                  },
                  position: "relative",
                }}
              >
                <ListItemAvatar>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      sx={{
                        bgcolor: getRandomColor(customer.name),
                        width: 48,
                        height: 48,
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        fontFamily: "Poppins, sans-serif",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {getInitials(customer.name)}
                    </Avatar>
                  </StyledBadge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#1a1a1a",
                        fontSize: "0.95rem",
                        mb: 0.5,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {customer.name}
                    </Typography>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha("#000", 0.6),
                          fontSize: "0.85rem",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {customer.bank}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#128C7E",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        EMI Due: ₹{customer.amount}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
              {index < customers.length - 1 && (
                <Divider
                  variant="inset"
                  component="li"
                  sx={{
                    ml: 2,
                    mr: 2,
                    opacity: 0.6,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default CustomerList;
