const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 5000;

// WhatsApp API credentials
const WHATSAPP_TOKEN = "EAAR4Iz3BWgkBOylKDwPTJgIZAeDSedJLrhO7vNVZBoPTXWDlJr6T8sjWmxwPOkcxGIeUXH5RUazrMyo6VD0GawYyOFNqAoOzvQfkGzbbAbSz5VDXEobwbNOZBs8uwJUie7UEAZC1x1uWnoE7fRu3VkfosOcbvcZAJpzkjckxZBbZB2ODKbGNgBYwXEwicMsOZBwO8CZB0SMh4ZCGDWiaycsPo7IxiIZBkSBxvN0UftNBrs4";
const PHONE_NUMBER_ID = "472391889294613";
const WEBHOOK_VERIFICATION_TOKEN = "wap-ccad-4574-a669-0e495dee75310"; // Updated verification token

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Store received messages in memory (in production, use a database)
const receivedMessages = [
  // Add a sample message to ensure there's always something to display
  {
    id: `sample-${Date.now()}`,
    from: '918511044804',
    type: 'text',
    content: 'Hello! This is a sample message from the webhook.',
    timestamp: new Date().toISOString(),
    read: false
  }
];

// Webhook verification endpoint - must be at /webhook for Meta to find it
app.get('/webhook', (req, res) => {
  console.log('Webhook verification request received');
  
  // Parse parameters from the webhook verification request
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === WEBHOOK_VERIFICATION_TOKEN) {
      // Respond with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      console.error('Verification failed. Token mismatch.');
      res.sendStatus(403);
    }
  } else {
    // Respond with '400 Bad Request' if required parameters are missing
    console.error('Missing required parameters');
    res.sendStatus(400);
  }
});

// Webhook for receiving messages - must be at /webhook for Meta to find it
app.post('/webhook', (req, res) => {
  console.log('Webhook message received:', JSON.stringify(req.body, null, 2));
  
  try {
    // Check if this is a WhatsApp message
    if (req.body.object === 'whatsapp_business_account' && 
        req.body.entry && 
        req.body.entry[0].changes && 
        req.body.entry[0].changes[0].value.messages && 
        req.body.entry[0].changes[0].value.messages[0]) {
      
      const message = req.body.entry[0].changes[0].value.messages[0];
      const from = message.from; // Sender's phone number
      const messageId = message.id;
      const timestamp = message.timestamp;
      
      // Process different message types
      let messageContent = '';
      let messageType = message.type;
      
      if (messageType === 'text') {
        messageContent = message.text.body;
      } else if (messageType === 'image' || messageType === 'video' || messageType === 'document') {
        messageContent = `Received ${messageType}`;
        // In a real implementation, you'd process the media ID and fetch the media
      } else if (messageType === 'location') {
        messageContent = `Received location: Lat ${message.location.latitude}, Long ${message.location.longitude}`;
      } else if (messageType === 'button') {
        messageContent = `Button pressed: ${message.button.text}`;
      } else {
        messageContent = `Received ${messageType} message`;
      }
      
      // Store the message
      receivedMessages.unshift({
        id: messageId,
        from,
        type: messageType,
        content: messageContent,
        timestamp: new Date(parseInt(timestamp) * 1000).toISOString(),
        read: false
      });
      
      // Mark message as read
      markMessageAsRead(messageId);
      
      console.log(`Message from ${from}: ${messageContent}`);
    }
    
    // Return a 200 OK response to acknowledge receipt - REQUIRED by Meta
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Still return 200 to acknowledge receipt as per Meta's requirements
    res.status(200).send('EVENT_RECEIVED');
  }
});

// Function to mark a message as read
async function markMessageAsRead(messageId) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_TOKEN}`
        }
      }
    );
    console.log('Message marked as read:', response.data);
  } catch (error) {
    console.error('Error marking message as read:', error.response?.data || error);
  }
}

// Function to send a WhatsApp text message
async function sendWhatsAppTextMessage(to, text) {
  try {
    console.log(`Sending WhatsApp message to ${to}: ${text}`);
    
    // Format the phone number with country code if needed
    let formattedPhone = to;
    if (!formattedPhone.startsWith('91') && !formattedPhone.startsWith('+91')) {
      formattedPhone = `91${formattedPhone}`;
    }
    
    // Remove any '+' sign if present
    formattedPhone = formattedPhone.replace('+', '');
    
    // Make the API request to WhatsApp
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "text",
        text: {
          body: text
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_TOKEN}`
        }
      }
    );
    
    console.log('WhatsApp API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response?.data || error);
    throw error;
  }
}

// API endpoint to get received messages
app.get('/api/messages', (req, res) => {
  res.json(receivedMessages);
});

// API endpoint for our frontend to get messages from the webhook
app.get('/api/webhook', (req, res) => {
  console.log('API webhook request received:', req.query);
  
  // Return the stored messages to our frontend
  res.json({ 
    success: true, 
    messages: receivedMessages.slice(0, 20) // Return the most recent 20 messages
  });
});

// Add a test message endpoint to simulate incoming messages
app.post('/api/webhook/test', (req, res) => {
  try {
    console.log('Test webhook request received:', req.body);
    
    const { text, from } = req.body;
    const messageId = `test-${Date.now()}`;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // Create a message in the format that Meta would send
    const testMessage = {
      id: messageId,
      from: from || '918511044804',
      type: 'text',
      text: {
        body: text || 'Test message from webhook'
      },
      timestamp: timestamp
    };
    
    // Add the message to our stored messages
    receivedMessages.unshift({
      id: testMessage.id,
      from: testMessage.from,
      type: 'text',
      content: testMessage.text.body,
      timestamp: new Date(parseInt(timestamp) * 1000).toISOString(),
      read: false
    });
    
    console.log('Test message added:', testMessage);
    console.log('Current messages:', receivedMessages.length);
    
    res.json({ 
      success: true, 
      message: 'Test message added',
      messageData: testMessage
    });
  } catch (error) {
    console.error('Error adding test message:', error);
    res.status(500).json({ error: 'Failed to add test message' });
  }
});

// API endpoint to send a message
app.post('/api/send-message', async (req, res) => {
  try {
    const { to, text } = req.body;
    
    if (!to || !text) {
      return res.status(400).json({ error: 'Phone number and message text are required' });
    }
    
    const result = await sendWhatsAppTextMessage(to, text);
    res.json(result);
  } catch (error) {
    console.error('Error in send-message endpoint:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// API endpoint to send a template message
app.post('/api/send-template', async (req, res) => {
  try {
    console.log('Template message request received:', req.body);
    
    const { to, templateName, languageCode, components } = req.body;
    
    if (!to || !templateName || !languageCode) {
      return res.status(400).json({ error: 'Phone number, template name, and language code are required' });
    }
    
    // Format the phone number with country code if needed
    let formattedPhone = to;
    if (!formattedPhone.startsWith('91') && !formattedPhone.startsWith('+91')) {
      formattedPhone = `91${formattedPhone}`;
    }
    
    // Remove any '+' sign if present
    formattedPhone = formattedPhone.replace('+', '');
    
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
            code: languageCode
          },
          components: components || []
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_TOKEN}`
        }
      }
    );
    
    console.log('Template message sent successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error in send-template endpoint:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to send template message' });
  }
});

// API endpoint to send a media message
app.post('/api/send-media', async (req, res) => {
  try {
    const { to, mediaType, mediaUrl, caption } = req.body;
    
    if (!to || !mediaType || !mediaUrl) {
      return res.status(400).json({ error: 'Phone number, media type, and media URL are required' });
    }
    
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: mediaType,
        [mediaType]: {
          link: mediaUrl,
          caption: caption || ''
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_TOKEN}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error in send-media endpoint:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to send media message' });
  }
});

// API endpoint to get media URL
app.get('/api/get-media-url/:mediaId', async (req, res) => {
  try {
    const mediaId = req.params.mediaId;
    
    if (!mediaId) {
      return res.status(400).json({ error: 'Media ID is required' });
    }
    
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error in get-media-url endpoint:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to get media URL' });
  }
});

// API endpoint to mark a message as read
app.post('/api/mark-as-read', async (req, res) => {
  try {
    const { messageId } = req.body;
    
    if (!messageId) {
      return res.status(400).json({ error: 'Message ID is required' });
    }
    
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_TOKEN}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error in mark-as-read endpoint:', error.response?.data || error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// Catch-all handler for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
