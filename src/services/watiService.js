import axios from "axios";

const WATI_API_BASE_URL = "https://live-mt-server.wati.io/337725/";
const WATI_API_KEY = process.env.REACT_APP_WATI_API_KEY;

const watiApi = axios.create({
  baseURL: WATI_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${WATI_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  },
  withCredentials: false,
});

// Add response interceptor to handle errors
watiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("CORS or Authentication Error:", error.response);
    }
    return Promise.reject(error);
  }
);

export const getContacts = async () => {
  try {
    const response = await watiApi.get("/api/v1/getContacts");
    if (
      response.data?.result === "success" &&
      Array.isArray(response.data.contact_list)
    ) {
      // Get all contacts and their last messages
      const contactsWithMessages = await Promise.all(
        response.data.contact_list.map(async (contact) => {
          try {
            const messages = await getMessages(contact.wAid);
            const lastMessage = messages[0]; // First message is the latest due to sorting
            return {
              id: contact.id,
              displayId: contact.wAid,
              fullName:
                contact.fullName || contact.firstName || contact.displayName,
              phone: contact.phone || contact.wAid,
              whatsappNumber: contact.wAid,
              created: contact.created,
              lastMessage: lastMessage?.content || "",
              lastMessageTime: lastMessage?.timestamp || null,
              status: contact.contactStatus,
            };
          } catch (error) {
            console.error(
              `Error fetching messages for contact ${contact.wAid}:`,
              error
            );
            return {
              id: contact.id,
              displayId: contact.wAid,
              fullName:
                contact.fullName || contact.firstName || contact.displayName,
              phone: contact.phone || contact.wAid,
              whatsappNumber: contact.wAid,
              created: contact.created,
              lastMessage: "",
              lastMessageTime: null,
              status: contact.contactStatus,
            };
          }
        })
      );

      // Sort contacts by last message time
      return contactsWithMessages.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

export const getMessages = async (whatsappNumber) => {
  try {
    // Remove any non-numeric characters from the phone number
    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    console.log("Fetching messages for:", cleanNumber);

    const response = await watiApi.get(`/api/v1/getMessages/${cleanNumber}`);
    console.log("Raw API response:", response.data);

    if (response.data.result === "success" && response.data.messages?.items) {
      // Filter only message events and transform them
      const messages = response.data.messages.items
        .filter((item) => item.eventType === "message")
        .map((message) => ({
          id: message.id,
          type: message.owner ? "sent" : "received",
          content: message.text,
          timestamp: new Date(message.created),
          sender: message.operatorName,
        }));

      // Sort messages by timestamp (oldest first)
      return messages.sort((a, b) => a.timestamp - b.timestamp);
    }
    return [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const sendMessage = async (whatsappNumber, message) => {
  try {
    // Remove any non-numeric characters from the phone number
    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    console.log("Sending message to:", cleanNumber);

    const response = await watiApi.post(
      `/api/v1/sendSessionMessage/${cleanNumber}`,
      {
        messageText: message,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getOperatorDetails = async (whatsappNumber) => {
  try {
    const response = await watiApi.get(`/api/v1/getOperator/${whatsappNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching operator details:", error);
    throw error;
  }
};
