import React, { useState, useEffect } from "react";
import { Box, Container, Grid, CssBaseline } from "@mui/material";
import CustomerList from "./components/CustomerList";
import ChatWindow from "./components/ChatWindow";
import Navbar from "./components/Navbar";
import { getContacts } from "./services/watiService";

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const contactsList = await getContacts();
        setCustomers(contactsList);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
    // Refresh contacts every 30 seconds
    const interval = setInterval(fetchContacts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCustomerSelect = (customer) => {
    console.log("Selected customer:", customer);
    setSelectedCustomer(customer);
  };

  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="xl" sx={{ height: "calc(100vh - 64px)", py: 2 }}>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item xs={12} md={4} sx={{ height: "100%" }}>
            <Box sx={{ height: "100%", overflow: "hidden" }}>
              <CustomerList
                customers={customers}
                onSelectCustomer={handleCustomerSelect}
                selectedCustomer={selectedCustomer}
                loading={loading}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={8} sx={{ height: "100%" }}>
            <Box sx={{ height: "100%", overflow: "hidden" }}>
              {selectedCustomer && <ChatWindow selectedCustomer={selectedCustomer} />}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
