import axios from "axios";

// Use our local API endpoints to avoid CORS issues
const API_BASE_URL = '/api';

/**
 * Format phone number with India country code (91) if not present
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phoneNumber) => {
  let formattedPhone = phoneNumber;
  if (formattedPhone.startsWith('+')) {
    formattedPhone = formattedPhone.substring(1);
  }
  if (!formattedPhone.startsWith('91') && formattedPhone.length === 10) {
    formattedPhone = '91' + formattedPhone;
  }
  return formattedPhone;
};

/**
 * Send a text message to a WhatsApp number
 * @param {string} to - Recipient's phone number with country code (e.g., "917006572213")
 * @param {string} text - Message text to send
 * @returns {Promise} - API response
 */
const sendTextMessage = async (to, text) => {
  try {
    const formattedTo = formatPhoneNumber(to);
    
    const messageData = {
      to: formattedTo,
      text: text
    };

    // Use our local API endpoint instead of calling Meta directly
    const response = await axios.post(`${API_BASE_URL}/send-message`, messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp text message:", error.response?.data || error);
    throw error;
  }
};

/**
 * Send a template message to a WhatsApp number
 * @param {string} to - Recipient's phone number with country code
 * @param {string} templateName - Name of the template
 * @param {string} languageCode - Language code (e.g., "en_US")
 * @param {Array} components - Template components with parameters
 * @returns {Promise} - API response
 */
const sendTemplateMessage = async (to, templateName, languageCode = "en_US", components = []) => {
  try {
    const formattedTo = formatPhoneNumber(to);
    
    const templateData = {
      to: formattedTo,
      templateName: templateName,
      languageCode: languageCode,
      components: components
    };

    // Use our local API endpoint instead of calling Meta directly
    const response = await axios.post(`${API_BASE_URL}/send-template`, templateData);
    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp template message:", error.response?.data || error);
    throw error;
  }
};

/**
 * Send an EMI payment reminder template
 * @param {Object} customerData - Customer data object
 * @returns {Promise} - API response
 */
const sendEmiPaymentReminder = async (customerData) => {
  try {
    const formattedTo = formatPhoneNumber(customerData.phone);
    
    const messageData = {
      to: formattedTo,
      templateName: "emipayments",
      languageCode: "kn",
      components: [
        {
          type: "text",
          text: customerData.name,
        },
        {
          type: "text",
          text: customerData.bank || "Federal Bank",
        },
        {
          type: "text",
          text: customerData.month,
        },
        {
          type: "currency",
          currency: {
            fallback_value: customerData.amount,
            code: "INR",
            amount_1000:
              parseFloat(customerData.amount.replace(/[^\d.]/g, "")) *
              1000,
          },
        },
        {
          type: "date_time",
          date_time: {
            fallback_value: customerData.dueDate,
          },
        },
      ],
    };

    // Use our local API endpoint instead of calling Meta directly
    const response = await axios.post(`${API_BASE_URL}/send-template`, messageData);
    return response.data;
  } catch (error) {
    console.error("Error sending EMI payment reminder:", error.response?.data || error);
    throw error;
  }
};

/**
 * Send a media message (image, document, video, etc.)
 * @param {string} to - Recipient's phone number with country code
 * @param {string} mediaType - Type of media (image, document, video, audio)
 * @param {string} mediaUrl - Public URL of the media
 * @param {string} caption - Optional caption for the media
 * @returns {Promise} - API response
 */
const sendMediaMessage = async (to, mediaType, mediaUrl, caption = "") => {
  try {
    const formattedTo = formatPhoneNumber(to);
    
    const messageData = {
      to: formattedTo,
      mediaType: mediaType,
      mediaUrl: mediaUrl,
      caption: caption,
    };

    // Use our local API endpoint instead of calling Meta directly
    const response = await axios.post(`${API_BASE_URL}/send-media`, messageData);
    return response.data;
  } catch (error) {
    console.error(`Error sending WhatsApp ${mediaType} message:`, error.response?.data || error);
    throw error;
  }
};

/**
 * Get media URL for a media message
 * @param {string} mediaId - ID of the media
 * @returns {Promise} - API response with media URL
 */
const getMediaUrl = async (mediaId) => {
  try {
    // Use our local API endpoint instead of calling Meta directly
    const response = await axios.get(`${API_BASE_URL}/get-media-url/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting media URL:", error.response?.data || error);
    throw error;
  }
};

/**
 * Mark a message as read
 * @param {string} messageId - ID of the message to mark as read
 * @returns {Promise} - API response
 */
const markMessageAsRead = async (messageId) => {
  try {
    const data = {
      messageId: messageId,
    };

    // Use our local API endpoint instead of calling Meta directly
    const response = await axios.post(`${API_BASE_URL}/mark-as-read`, data);
    return response.data;
  } catch (error) {
    console.error("Error marking message as read:", error.response?.data || error);
    throw error;
  }
};

const metaWhatsAppService = {
  formatPhoneNumber,
  sendTextMessage,
  sendTemplateMessage,
  sendEmiPaymentReminder,
  sendMediaMessage,
  getMediaUrl,
  markMessageAsRead
};

export default metaWhatsAppService;
