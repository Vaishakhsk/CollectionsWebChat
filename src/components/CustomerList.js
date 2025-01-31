import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Typography, 
  Divider,
  CircularProgress
} from '@mui/material';

const CustomerList = ({ customers, selectedCustomer, onSelectCustomer, loading }) => {
  if (loading) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', height: '100%', overflowY: 'auto' }}>
      <List>
        {customers.map((customer, index) => (
          <React.Fragment key={customer.id}>
            <ListItemButton 
              selected={selectedCustomer?.id === customer.id}
              onClick={() => onSelectCustomer(customer)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 500 }}>
                    {customer.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    EMI Due: ₹{customer.amount}
                  </Typography>
                }
              />
            </ListItemButton>
            {index < customers.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default CustomerList;
