import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Grid, Snackbar, Alert } from '@mui/material';
import Navbar from './components/Navbar';
import CustomerList from './components/CustomerList';
import ChatWindow from './components/ChatWindow';
import { getCustomers, sendWhatsAppMessage } from './services/api';

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
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
      console.error('Error fetching customers:', error);
      setSnackbar({
        open: true,
        message: 'Error loading customers',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleCustomerSelect = async (customer) => {
    setSelectedCustomer(customer);
    try {
      await sendWhatsAppMessage(customer);
      setSnackbar({
        open: true,
        message: 'WhatsApp message sent successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error sending WhatsApp message',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box className="app-container">
      <Navbar />
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 2 }}>
        <Paper
          elevation={3}
          sx={{
            height: 'calc(100vh - 100px)',
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <Grid container>
            <Grid
              item
              xs={3}
              sx={{
                borderRight: 1,
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <CustomerList
                customers={customers}
                selectedCustomer={selectedCustomer}
                onSelectCustomer={handleCustomerSelect}
                loading={loading}
              />
            </Grid>
            <Grid item xs={9}>
              <ChatWindow selectedCustomer={selectedCustomer} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
