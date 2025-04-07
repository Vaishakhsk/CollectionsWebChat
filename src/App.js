import React, { useState, useEffect } from "react";
import { Box, Container, Grid, CssBaseline, Tabs, Tab, Paper, Alert } from "@mui/material";
import CustomerList from "./components/CustomerList";
import ChatWindow from "./components/ChatWindow";
import WhatsAppMessenger from "./components/WhatsAppMessenger";
import Navbar from "./components/Navbar";
import { getContacts } from "./services/watiService";

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1); // Set default to Meta WhatsApp Business API tab
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const contactsList = await getContacts();
        setCustomers(contactsList || []);
        setApiError(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setApiError(true);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch contacts if the WATI tab is active
    if (activeTab === 0) {
      fetchContacts();
      // Refresh contacts every 30 seconds
      const interval = setInterval(fetchContacts, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleCustomerSelect = (customer) => {
    console.log("Selected customer:", customer);
    setSelectedCustomer(customer);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="xl" sx={{ height: "calc(100vh - 64px)", py: 2 }}>
        <Paper sx={{ mb: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="WATI Chat Interface" />
            <Tab label="Meta WhatsApp Business API" />
          </Tabs>
        </Paper>

        {activeTab === 0 ? (
          <>
            {apiError && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Unable to connect to WATI API. Please check your API credentials or try again later.
              </Alert>
            )}
            <Grid container spacing={2} sx={{ height: "calc(100% - 48px)" }}>
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
          </>
        ) : (
          <Box sx={{ height: "calc(100% - 48px)" }}>
            <WhatsAppMessenger />
          </Box>
        )}
      </Container>
    </>
  );
}

export default App;
