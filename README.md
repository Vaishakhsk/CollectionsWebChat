# WhatsApp EMI Application

A modern React application for managing EMI communications through WhatsApp. This application provides a beautiful and intuitive interface for managing customer EMI details and communications.

## 🚀 Features

- 💬 Chat interface
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
- **Font**: Poppins

## 🏗️ Project Structure

```
whatsappemi/
├── src/
│   ├── components/
│   │   ├── ChatWindow.js      # Chat interface component
│   │   ├── CustomerList.js    # Sidebar customer list
│   │   └── Navbar.js          # Application navbar
│   ├── services/
│   │   └── api.js            # API service functions
│   └── App.js                # Main application component
├── public/
└── package.json
```

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd whatsappemi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The application will start running at `http://localhost:3000`

## 💻 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## 🎨 UI Features

- **Modern Design**: Clean and intuitive interface with Material-UI components
- **Responsive Layout**: Adapts seamlessly to different screen sizes
- **Custom Styling**:
  - Poppins font throughout the application
  - WhatsApp-inspired color scheme
  - Smooth animations and transitions
  - Custom avatar badges with pulsing effect

## 🔧 Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_API_URL=your_api_url_here
```

## 📱 Component Details

### CustomerList

- Displays list of customers with EMI details
- Real-time search functionality
- Custom styled badges and avatars
- Smooth hover animations

### ChatWindow

- WhatsApp-style chat interface
- Message history display
- Real-time message updates

### Navbar

- Application header with branding
- Navigation controls
- User account management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Vaishakhsk** -

## 🙏 Acknowledgments

- Material-UI team for the amazing component library
- React team for the excellent framework
- All contributors who have helped shape this project
