# WhatsApp EMI Application

A modern React application for managing EMI communications through WhatsApp. This application provides a beautiful and intuitive interface for managing customer EMI details and communications.

## 🚀 Features

- 💬 Chat interface with WATI integration
- 🔄 Meta WhatsApp Business API integration
- 🪝 Webhook support for receiving messages
- 👥 Customer management with EMI details
- 🔍 Real-time search functionality
- 💅 Modern and responsive Material-UI design
- 📱 Mobile-friendly interface

## 🛠️ Tech Stack

- **Frontend Framework**: React (v19.0.0)
- **UI Library**: Material-UI (v6.4.2)
- **Styling**: Emotion (v11.14.0)
- **Icons**: Material Icons
- **HTTP Client**: Axios
- **Backend**: Express.js
- **API Integration**: WhatsApp Business API
- **Font**: Poppins

## 🏗️ Project Structure

```
whatsappemi/
├── src/
│   ├── components/
│   │   ├── ChatWindow.js         # Chat interface component
│   │   ├── CustomerList.js       # Sidebar customer list
│   │   ├── Navbar.js             # Application navbar
│   │   └── WhatsAppMessenger.js  # Meta WhatsApp Business API interface
│   ├── services/
│   │   ├── api.js                # API service functions
│   │   ├── watiService.js        # WATI API integration
│   │   └── metaWhatsAppService.js # Meta WhatsApp Business API integration
│   └── App.js                    # Main application component
├── public/
├── server.js                     # Express server for webhook handling
└── package.json
```
## 💻 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run server` - Runs the Express server for webhook handling
- `npm run dev` - Runs both the React app and Express server concurrently
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## 🔧 Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_WHATSAPP_API_URL=https://graph.facebook.com/v18.0/your_phone_number_id
REACT_APP_WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
REACT_APP_WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
REACT_APP_WEBHOOK_URL=your_webhook_url
PORT=5000
```

## 🪝 Webhook Setup

To receive messages from WhatsApp, you need to set up a webhook in the Meta Developer Portal:

1. Go to your Meta Developer Portal and navigate to your WhatsApp Business app
2. Set up a webhook with the following URL:
   - Callback URL: `https://your-domain.com/webhook` (or use a service like ngrok for local development)
   - Verify token: Set a custom verification token and update it in your server.js file
3. Subscribe to the following webhook fields:
   - `messages`
   - `message_status`

## 📱 WhatsApp Business API Integration

The application uses the Meta WhatsApp Business API to send and receive messages. Key features include:

- Send text messages to customers
- Send template messages for EMI reminders
- Receive and display incoming messages
- Support for media messages (images, documents, etc.)
- Message status tracking

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Vaishakhsk** -
