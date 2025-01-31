import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ChatWindow = ({ selectedCustomer }) => {
  if (!selectedCustomer) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          bgcolor: '#f8f9fa',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a customer to view EMI details
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', bgcolor: '#f8f9fa', p: 2, overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Sender message (EMI notification) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              maxWidth: '70%',
              bgcolor: '#e3f2fd',
              borderRadius: '12px 12px 0 12px',
            }}
          >
            <Typography variant="body1" gutterBottom>
              Dear {selectedCustomer.name},
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your EMI payment for {selectedCustomer.month} is due.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Amount: ₹{selectedCustomer.amount}
            </Typography>
            <Typography variant="body1">
              Due Date: {selectedCustomer.dueDate}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;
