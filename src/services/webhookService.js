import axios from 'axios';

// Use the API endpoint to get messages from our server
const WEBHOOK_URL = 'https://dhanamsit.com/api/messages'; // Update the API endpoint URL

// Store for incoming messages
let incomingMessages = [];
let messageListeners = [];
let pollingActive = true; // Flag to control polling

/**
 * Initialize webhook polling
 * Polls the webhook endpoint for new messages
 */
export const initWebhookPolling = () => {
  console.log('Initializing webhook polling for incoming WhatsApp messages');
  pollingActive = true;
  
  // Poll for new messages every 10 seconds
  const pollInterval = setInterval(async () => {
    if (!pollingActive) {
      clearInterval(pollInterval);
      return;
    }
    
    try {
      await fetchWebhookMessages();
    } catch (error) {
      console.error('Error polling webhook:', error);
      // Don't stop polling on error, just log it
    }
  }, 10000);
  
  return () => {
    pollingActive = false;
    clearInterval(pollInterval);
  };
};

/**
 * Fetch messages from the webhook endpoint
 */
export const fetchWebhookMessages = async () => {
  try {
    // Configure axios for the request
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Add a timestamp to avoid caching
      params: {
        t: Date.now()
      }
    };
    
    // Make a GET request to our local server endpoint that stores messages
    const response = await axios.get(WEBHOOK_URL, config);
    
    if (response.data) {
      // The server returns an array directly
      const newMessages = Array.isArray(response.data) ? response.data : [];
      
      if (newMessages.length > 0) {
        console.log('Received webhook messages:', newMessages.length);
        
        // Add new messages to the store if they don't already exist
        const existingIds = incomingMessages.map(msg => msg.id);
        const uniqueNewMessages = newMessages.filter(msg => !existingIds.includes(msg.id));
        
        if (uniqueNewMessages.length > 0) {
          // Add new messages to the store
          incomingMessages = [...uniqueNewMessages, ...incomingMessages];
          
          // Notify listeners
          notifyMessageListeners(uniqueNewMessages);
          
          return uniqueNewMessages;
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching webhook messages:', error);
    
    // Log more detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return [];
  }
};

/**
 * Get all stored incoming messages
 */
export const getIncomingMessages = () => {
  return [...incomingMessages];
};

/**
 * Add a message listener
 * @param {Function} listener - Function to call when new messages arrive
 */
export const addMessageListener = (listener) => {
  messageListeners.push(listener);
  return () => {
    messageListeners = messageListeners.filter(l => l !== listener);
  };
};

/**
 * Notify all message listeners
 * @param {Array} messages - New messages
 */
const notifyMessageListeners = (messages) => {
  messageListeners.forEach(listener => {
    try {
      listener(messages);
    } catch (error) {
      console.error('Error in message listener:', error);
    }
  });
};

/**
 * Manually add a test message (for development)
 * @param {Object} message - Message object
 */
export const addTestMessage = (message) => {
  const formattedMessage = {
    id: `test-${Date.now()}`,
    from: 'external',
    type: 'text',
    content: message.text || 'Test message',
    timestamp: new Date().toISOString(),
    senderPhone: message.from || '918511044804',
    read: false,
    raw: message
  };
  
  incomingMessages = [...incomingMessages, formattedMessage];
  notifyMessageListeners([formattedMessage]);
  
  return formattedMessage;
};

// Create the webhookService object
const webhookService = {
  initWebhookPolling,
  fetchWebhookMessages,
  getIncomingMessages,
  addMessageListener,
  addTestMessage
};

export default webhookService;
