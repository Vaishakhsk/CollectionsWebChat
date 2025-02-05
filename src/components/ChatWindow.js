import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { getMessages, sendMessage } from "../services/watiService";
import { formatDistanceToNow } from "date-fns";

const ChatWindow = ({ selectedCustomer }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!selectedCustomer?.whatsappNumber) return;

    try {
      setLoading(true);
      console.log("Fetching messages for:", selectedCustomer.whatsappNumber);
      const data = await getMessages(selectedCustomer.whatsappNumber);
      console.log("Fetched messages:", data);
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setSnackbar({
        open: true,
        message: "Failed to load messages",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages when customer changes
  useEffect(() => {
    console.log("Selected customer changed:", selectedCustomer);
    if (selectedCustomer?.whatsappNumber) {
      fetchMessages();
    }
  }, [selectedCustomer]);

  // Set up auto-refresh interval
  useEffect(() => {
    if (selectedCustomer?.whatsappNumber) {
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedCustomer]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0; // Scroll to top for newest messages
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCustomer?.whatsappNumber) return;

    try {
      console.log("Sending message to:", selectedCustomer.whatsappNumber);
      await sendMessage(selectedCustomer.whatsappNumber, newMessage);
      
      // Add message to local state immediately
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "sent",
          content: newMessage,
          timestamp: new Date(),
          sender: "You"
        },
      ]);
      setNewMessage("");
      
      // Fetch messages to get the updated list
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      setSnackbar({
        open: true,
        message: "Failed to send message",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formatMessageTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  if (!selectedCustomer) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a customer to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "primary.light",
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          {selectedCustomer.fullName?.[0] || "?"}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            {selectedCustomer.fullName || selectedCustomer.whatsappNumber}
          </Typography>
          <Typography variant="body2" sx={{ color: "white" }}>
            {selectedCustomer.whatsappNumber}
          </Typography>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flexGrow: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse", // Reverse the direction
          gap: 1,
          p: 2,
          bgcolor: "#f5f5f5",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography color="text.secondary">No messages yet</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column-reverse" }}>
            {messages.map((message, index) => (
              <Box
                key={message.id || index}
                sx={{
                  alignSelf: message.type === "sent" ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: message.type === "sent" ? "#DCF8C6" : "white",
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  {message.sender && (
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ display: "block", mb: 0.5, fontWeight: "medium" }}
                    >
                      {message.sender}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {message.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5, textAlign: "right" }}
                  >
                    {formatMessageTime(message.timestamp)}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Send
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ChatWindow;
