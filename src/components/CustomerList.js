import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { formatDistanceToNow } from "date-fns";
import { getContacts } from "../services/watiService";

const CustomerList = ({ onSelectCustomer, selectedCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
    // Refresh contacts every 30 seconds
    const interval = setInterval(fetchCustomers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContacts();
      console.log("Fetched customers:", data);
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerClick = (customer) => {
    console.log("Clicked customer:", customer);
    if (onSelectCustomer) {
      onSelectCustomer(customer);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.whatsappNumber?.includes(searchTerm)
  );

  const formatMessagePreview = (message) => {
    if (!message) return "";
    return message.length > 50 ? message.substring(0, 47) + "..." : message;
  };

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <List sx={{ flexGrow: 1, overflow: "auto", px: 0 }}>
          {filteredCustomers.map((customer) => (
            <React.Fragment key={customer.id}>
              <ListItem
                button
                selected={selectedCustomer?.id === customer.id}
                onClick={() => handleCustomerClick(customer)}
                sx={{
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                  "&.Mui-selected": {
                    bgcolor: "primary.light",
                    "&:hover": {
                      bgcolor: "primary.light",
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {customer.fullName?.[0] || "?"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" noWrap>
                      {customer.fullName || customer.whatsappNumber}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        component="div"
                      >
                        {customer.whatsappNumber}
                      </Typography>
                      {customer.lastMessage && (
                        <>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ mt: 0.5 }}
                          >
                            {formatMessagePreview(customer.lastMessage)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {customer.lastMessageTime
                              ? formatDistanceToNow(new Date(customer.lastMessageTime), {
                                  addSuffix: true,
                                })
                              : ""}
                          </Typography>
                        </>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default CustomerList;
