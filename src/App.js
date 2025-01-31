import { Alert, Box, Container, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import CustomerList from "./components/CustomerList";
import Navbar from "./components/Navbar";
import { getCustomers } from "./services/api";

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setSnackbar({
        open: true,
        message: "Error loading customers",
        severity: "error",
      });
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleNewChat = (newCustomer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    setSelectedCustomer(newCustomer);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ height: "100vh" }}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <Box
          sx={{
            width: 400,
            borderRight: 1,
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Navbar onNewChat={handleNewChat} />
          <CustomerList
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={handleCustomerSelect}
            loading={loading}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatWindow selectedCustomer={selectedCustomer} />
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#075E54",
            borderRadius: "4px",
            minWidth: "auto",
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          icon={false}
          sx={{
            backgroundColor:
              snackbar.severity === "success" ? "#128C7E" : "#d32f2f",
            color: "#fff",
            "& .MuiAlert-action": {
              alignItems: "center",
              color: "#fff",
            },
            minWidth: "auto",
            px: 2,
            py: 1,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
