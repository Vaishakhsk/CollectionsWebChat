import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useState } from "react";
import { sendWhatsAppMessage } from "../services/api";

const ChatWindow = ({ selectedCustomer }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        content: message,
        timestamp: new Date(),
        type: "sent",
      };
      setMessages((prev) => [...prev, newMessage]);

      if (message.trim().toUpperCase() === "EMI") {
        try {
          await sendWhatsAppMessage(selectedCustomer);
          setSnackbar({
            open: true,
            message: "WhatsApp message sent successfully!",
            severity: "success",
          });
        } catch (error) {
          setSnackbar({
            open: true,
            message: "Error sending WhatsApp message",
            severity: "error",
          });
        }
      }
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (!selectedCustomer) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          bgcolor: "#f0f2f5",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: alpha("#128C7E", 0.1),
            color: "#128C7E",
          }}
        >
          💬
        </Avatar>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontFamily: "Poppins" }}
        >
          Select a customer to view EMI details
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Chat Header */}
      <Paper
        elevation={1}
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderRadius: 0,
          backgroundColor: "#f0f2f5",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#128C7E",
            width: 40,
            height: 40,
          }}
        >
          {getInitials(selectedCustomer.name)}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {selectedCustomer.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedCustomer.bank}
          </Typography>
        </Box>
      </Paper>

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#efeae2",
          backgroundImage:
            "linear-gradient(rgba(229, 221, 213, 0.85), rgba(229, 221, 213, 0.85))",
          overflow: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Paper
            sx={{
              py: 0.5,
              px: 2,
              maxWidth: "70%",
              backgroundColor: "#FFF",
              borderRadius: "8px",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Messages are end-to-end encrypted
            </Typography>
          </Paper>
        </Box>

        {/* EMI Message */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              maxWidth: "70%",
              bgcolor: "#dcf8c6",
              borderRadius: "8px 8px 0 8px",
              position: "relative",
            }}
          >
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              EMI Amount: ₹{selectedCustomer.amount}
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              Month: {selectedCustomer.month}
            </Typography>
            <Typography variant="body1">
              Due Date: {selectedCustomer.dueDate}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "right",
                mt: 1,
                color: "text.secondary",
              }}
            >
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Paper>
        </Box>

        {/* User Messages */}
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.type === "sent" ? "flex-end" : "flex-start",
              gap: 1,
            }}
          >
            {msg.type !== "sent" && (
              <Avatar
                sx={{
                  bgcolor: "#128C7E",
                  width: 35,
                  height: 35,
                  fontSize: "0.9rem",
                }}
              >
                {getInitials(selectedCustomer.name)}
              </Avatar>
            )}
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: "70%",
                bgcolor: msg.type === "sent" ? "#dcf8c6" : "#FFF",
                borderRadius:
                  msg.type === "sent" ? "8px 8px 0 8px" : "0 8px 8px 8px",
              }}
            >
              <Typography variant="body1">{msg.content}</Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  mt: 1,
                  color: "text.secondary",
                }}
              >
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Message Input */}
      <Paper
        component="form"
        sx={{
          p: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#f0f2f5",
          borderRadius: 0,
        }}
      >
        <IconButton color="default">
          <AttachFileIcon />
        </IconButton>
        <InputBase
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            flex: 1,
            backgroundColor: "#FFF",
            borderRadius: "8px",
            px: 2,
            py: 1,
          }}
          placeholder="Type a message"
        />
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          sx={{
            bgcolor: "#128C7E",
            color: "#FFF",
            "&:hover": {
              bgcolor: "#075E54",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#075E54",
            borderRadius: "4px",
            minWidth: "auto",
          },
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          icon={false}
          sx={{
            backgroundColor:
              snackbar.severity === "success" ? "#128C7E" : "#d32f2f",
            color: "#fff",
            "& .MuiAlert-action": {
              alignItems: "center",
              color: "#fff",
            },
            minWidth: "auto",
            px: 2,
            py: 1,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatWindow;
