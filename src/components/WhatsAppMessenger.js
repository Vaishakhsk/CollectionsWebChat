import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Divider,
  InputAdornment
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PhoneIcon from '@mui/icons-material/Phone';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  initWebhookPolling, 
  fetchWebhookMessages, 
  addMessageListener, 
  addTestMessage 
} from '../services/webhookService';

const WhatsAppMessenger = () => {
  // State variables
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Refs
  const messagesEndRef = useRef(null);

  // Initialize with welcome messages and start webhook polling
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-1',
        from: 'system',
        type: 'text',
        content: 'Welcome to the WhatsApp Business API Messenger!',
        timestamp: new Date().toISOString(),
        read: true
      },
      {
        id: 'welcome-2',
        from: 'system',
        type: 'text',
        content: 'Enter a phone number and send a message to get started.',
        timestamp: new Date().toISOString(),
        read: true
      },
      {
        id: 'webhook-info',
        from: 'system',
        type: 'text',
        content: 'Listening for incoming messages from webhook: https://wso-prod-dhanam.mifix.io/cts/1.0/payment/verify-whatsapp-webhook',
        timestamp: new Date().toISOString(),
        read: true
      }
    ]);

    // Initialize webhook polling
    const stopPolling = initWebhookPolling();
    
    // Set up message listener for incoming webhook messages
    const removeListener = addMessageListener((newMessages) => {
      if (newMessages && newMessages.length > 0) {
        setMessages(prevMessages => [
          ...(Array.isArray(prevMessages) ? prevMessages : []),
          ...newMessages
        ]);
        
        // Show notification for new messages
        setSnackbarOpen(true);
        setSnackbarMessage(`Received ${newMessages.length} new message(s)`);
      }
    });
    
    // Initial fetch of webhook messages
    fetchWebhookMessages().then(newMessages => {
      if (newMessages && newMessages.length > 0) {
        setMessages(prevMessages => [
          ...(Array.isArray(prevMessages) ? prevMessages : []),
          ...newMessages
        ]);
      }
    });
    
    // Clean up on unmount
    return () => {
      stopPolling();
      removeListener();
    };
  }, [setMessages, setSnackbarOpen, setSnackbarMessage]); // Add dependencies here

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a text message
  const handleSendMessage = async () => {
    try {
      if (!phoneNumber || !message.trim()) {
        setError('Please enter both phone number and message');
        return;
      }
      
      setLoading(true);
      
      // Format the phone number with country code if needed
      let formattedPhone = phoneNumber;
      if (!formattedPhone.startsWith('91') && !formattedPhone.startsWith('+91')) {
        formattedPhone = `91${formattedPhone}`;
      }
      
      // Remove any '+' sign if present
      formattedPhone = formattedPhone.replace('+', '');
      
      console.log('Sending message to:', formattedPhone);
      
      // WhatsApp API credentials
      const PHONE_NUMBER_ID = "472391889294613";
      const WHATSAPP_TOKEN = "EAAR4Iz3BWgkBOylKDwPTJgIZAeDSedJLrhO7vNVZBoPTXWDlJr6T8sjWmxwPOkcxGIeUXH5RUazrMyo6VD0GawYyOFNqAoOzvQfkGzbbAbSz5VDXEobwbNOZBs8uwJUie7UEAZC1x1uWnoE7fRu3VkfosOcbvcZAJpzkjckxZBbZB2ODKbGNgBYwXEwicMsOZBwO8CZB0SMh4ZCGDWiaycsPo7IxiIZBkSBxvN0UftNBrs4";
      
      // Make a direct call to the WhatsApp API
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedPhone,
          type: "text",
          text: {
            body: message
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${WHATSAPP_TOKEN}`
          }
        }
      );
      
      console.log('Message sent:', response.data);
      
      // Add the sent message to the messages
      setMessages(prevMessages => [
        {
          id: response.data.messages?.[0]?.id || `local-${Date.now()}`,
          from: 'me',
          type: 'text',
          content: message,
          timestamp: new Date().toISOString(),
          read: true
        },
        ...(Array.isArray(prevMessages) ? prevMessages : [])
      ]);
      
      // Clear the message input
      setMessage('');
      setSnackbarOpen(true);
      setSnackbarMessage('Message sent successfully!');
      setError('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Send a template message
  const handleSendTemplate = async (templateName) => {
    try {
      if (!phoneNumber) {
        setError('Please enter a phone number');
        return;
      }
      
      setLoading(true);
      
      // Format the phone number with country code if needed
      let formattedPhone = phoneNumber;
      if (!formattedPhone.startsWith('91') && !formattedPhone.startsWith('+91')) {
        formattedPhone = `91${formattedPhone}`;
      }
      
      // Remove any '+' sign if present
      formattedPhone = formattedPhone.replace('+', '');
      
      console.log('Sending template to:', formattedPhone);
      
      // WhatsApp API credentials
      const PHONE_NUMBER_ID = "472391889294613";
      const WHATSAPP_TOKEN = "EAAR4Iz3BWgkBOylKDwPTJgIZAeDSedJLrhO7vNVZBoPTXWDlJr6T8sjWmxwPOkcxGIeUXH5RUazrMyo6VD0GawYyOFNqAoOzvQfkGzbbAbSz5VDXEobwbNOZBs8uwJUie7UEAZC1x1uWnoE7fRu3VkfosOcbvcZAJpzkjckxZBbZB2ODKbGNgBYwXEwicMsOZBwO8CZB0SMh4ZCGDWiaycsPo7IxiIZBkSBxvN0UftNBrs4";
      
      // Prepare components based on template type
      let components = [];
      
      if (templateName === 'emi_template') {
        components = [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: "User"
              },
              {
                type: "text",
                text: "5000"
              },
              {
                type: "text",
                text: "3"
              }
            ]
          }
        ];
      }
      
      // Make a direct call to the WhatsApp API
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedPhone,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: "en_US"
            },
            components: components || []
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${WHATSAPP_TOKEN}`
          }
        }
      );
      
      console.log('Template sent:', response.data);
      
      // Add the sent template to the messages
      setMessages(prevMessages => [
        {
          id: response.data.messages?.[0]?.id || `local-${Date.now()}`,
          from: 'me',
          type: 'template',
          content: `${templateName} template sent`,
          timestamp: new Date().toISOString(),
          read: true
        },
        ...(Array.isArray(prevMessages) ? prevMessages : [])
      ]);
      
      setSnackbarOpen(true);
      setSnackbarMessage('Template sent successfully!');
      setError('');
    } catch (err) {
      console.error('Error sending template:', err);
      setError('Failed to send template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Test webhook with a sample message
  const handleTestWebhook = async () => {
    try {
      setLoading(true);
      
      // Use axios to call our test webhook endpoint through the proxy
      const response = await axios.post('/api/webhook/test', {
        text: 'This is a test message from the webhook',
        from: phoneNumber || '918511044804'
      });
      
      console.log('Test webhook response:', response.data);
      
      if (response.data.success) {
        setSnackbarOpen(true);
        setSnackbarMessage('Test message added to webhook');
        
        // Add the test message to our messages
        const testMessage = response.data.messageData;
        addTestMessage(testMessage);
      }
    } catch (err) {
      console.error('Error testing webhook:', err);
      setError('Failed to test webhook. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Manually fetch webhook messages
  const handleRefreshMessages = async () => {
    setLoading(true);
    try {
      await fetchWebhookMessages();
      setSnackbarOpen(true);
      setSnackbarMessage("Messages refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing messages:", error);
      setError("Failed to refresh messages: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      return format(new Date(timestamp), 'MMM d, h:mm a');
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '';
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Card sx={{ mb: 2 }}>
        <CardHeader 
          title="WhatsApp Business API Messenger" 
          subheader="Send and receive messages using Meta WhatsApp Business API"
        />
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleTestWebhook}
                sx={{ mr: 1 }}
              >
                Test Webhook
              </Button>
              <IconButton 
                onClick={handleRefreshMessages} 
                color="primary"
                sx={{ mr: 1 }}
              >
                <RefreshIcon />
              </IconButton>
              <IconButton 
                color="primary"
                sx={{ mr: 1 }}
              >
                <AttachFileIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => handleSendTemplate('hello_world')}
                  disabled={loading || !phoneNumber}
                  sx={{ flexGrow: 1 }}
                >
                  Send Hello World Template
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => handleSendTemplate('emi_template')}
                  disabled={loading || !phoneNumber}
                  sx={{ flexGrow: 1 }}
                >
                  Send EMI Template
                </Button>
              </Box>
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Paper 
        elevation={3} 
        sx={{ 
          flexGrow: 1, 
          mb: 2, 
          display: 'flex', 
          flexDirection: 'column',
          height: '60vh',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#075E54', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: '#128C7E' }}>W</Avatar>
            <Typography variant="h6">
              WhatsApp Messages
            </Typography>
          </Box>
          <Typography variant="caption">
            Webhook: Active
          </Typography>
        </Box>
        
        <Divider />
        
        <List 
          sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: 2,
            backgroundColor: '#ECE5DD'
          }}
        >
          {!Array.isArray(messages) || messages.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ py: 4, color: 'text.secondary' }}>
              No messages yet. Start a conversation!
            </Typography>
          ) : (
            messages.map((message) => (
              <ListItem 
                key={message.id || `msg-${Math.random()}`}
                sx={{ 
                  justifyContent: message.from === 'me' ? 'flex-end' : 'flex-start',
                  mb: 1,
                  p: 0
                }}
              >
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    maxWidth: '70%',
                    backgroundColor: 
                      message.from === 'me' ? '#DCF8C6' : 
                      message.from === 'system' ? '#E1F5FE' : 
                      message.from === 'external' ? '#FFFFFF' : 'white',
                    borderRadius: 2
                  }}
                >
                  {message.from === 'external' && (
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                      From: {message.senderPhone || 'Unknown'}
                    </Typography>
                  )}
                  <ListItemText 
                    primary={message.content}
                    secondary={formatTimestamp(message.timestamp)}
                    secondaryTypographyProps={{ 
                      variant: 'caption',
                      sx: { display: 'block', textAlign: 'right', mt: 0.5 }
                    }}
                  />
                </Paper>
              </ListItem>
            ))
          )}
          <div ref={messagesEndRef} />
        </List>
        
        <Divider />
        
        <Box sx={{ p: 2, display: 'flex', backgroundColor: '#F0F0F0' }}>
          <IconButton sx={{ mr: 1 }}>
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={loading || !message.trim() || !phoneNumber}
            sx={{ ml: 1, bgcolor: '#128C7E' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
          </Button>
        </Box>
      </Paper>

      {/* Snackbar for test webhook */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WhatsAppMessenger;
