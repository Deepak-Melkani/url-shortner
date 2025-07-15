# URL Shortener 🔗

A modern, feature-rich URL shortener web application built with React, TypeScript, and Material UI. This application provides a simple way to shorten long URLs while offering detailed analytics and user management.

## ✨ Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Real-time Analytics**: Track clicks, views, and user engagement
- **User Authentication**: Secure login system with demo accounts
- **Responsive Design**: Beautiful Material UI interface that works on all devices
- **Statistics Dashboard**: Comprehensive analytics with charts and data tables
- **Click Tracking**: Detailed logging of all URL interactions
- **Copy to Clipboard**: One-click URL copying functionality
- **Protected Routes**: Secure access to application features


## 📸 Screenshots

> ### 👀 **Please refer to the images below to see the application interface and features in action!**

### Main URL Shortener Interface

**🔗 If image doesn't show, view directly:** [Main Interface Screenshot](https://drive.google.com/file/d/1v7jZUwQ9e7Pk3-fo1jzLrO4Whms9XsgJ/view)

### Analytics Dashboard

**🔗 If image doesn't show, view directly:** [Analytics Dashboard Screenshot](https://drive.google.com/file/d/1v7Ct6UfAtK9ni_paVsI40X26z-AK0NrE/view)

> **📌 Note:** These screenshots showcase the clean Material UI design, user-friendly interface, and comprehensive analytics features of the application.

### Demo Accounts
You can use these demo accounts to test the application:
- **Username**: `demo` | **Password**: `password123`
- **Username**: `testuser` | **Password**: `testpass`
- **Username**: `admin` | **Password**: `admin123`

## 🛠️ Technology Stack

- **Frontend**: React 19 with TypeScript
- **UI Library**: Material UI (MUI) v7
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Vite
- **Styling**: Material UI Theme System
- **Icons**: Material UI Icons
- **Data Storage**: Browser LocalStorage
- **Linting**: ESLint

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pawandasila/url-shortner.git
   cd url-shortner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Getting Started
1. **Login**: Use one of the demo accounts or the application's authentication system
2. **Shorten URLs**: Enter a long URL and get an instant short link
3. **Copy & Share**: Use the copy button to share your shortened URLs
4. **Track Analytics**: Visit the Statistics page to see detailed click data
5. **Manage URLs**: View all your shortened URLs in one place

### Key Pages
- **Home (`/`)**: Main URL shortening interface
- **Statistics (`/stats`)**: Analytics dashboard with charts and tables
- **Login (`/login`)**: User authentication page

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navigation.tsx   # Top navigation bar
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state management
│   └── URLContext.tsx   # URL data and analytics
├── pages/               # Main application pages
│   ├── Login.tsx        # User login interface
│   ├── URLShortener.tsx # URL shortening page
│   ├── Statistics.tsx   # Analytics dashboard
│   └── RedirectHandler.tsx # URL redirect logic
├── lib/                 # Utility libraries
│   └── logger.ts        # Application logging system
├── theme.ts             # Material UI theme configuration
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality

## 📊 Features Overview

### URL Shortening
- Generate short, unique URLs for any long link
- Instant copy-to-clipboard functionality
- Validation for proper URL format
- Real-time feedback and error handling

### Analytics Dashboard
- Total URLs created
- Total clicks tracked
- Most popular URLs
- Recent activity feed
- Interactive data tables
- Click tracking per URL

### User Authentication
- Secure login system
- Session management
- Protected routes
- User profile display
- Logout functionality

### User Experience
- Responsive design for mobile and desktop
- Indian-English friendly interface
- Clean, modern Material UI design
- Loading states and error handling
- Intuitive navigation

## 🔒 Security Features

- Route protection for unauthorized access
- Input validation and sanitization
- Secure session management
- XSS protection through React
- Safe URL handling

## 🌟 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you have any questions or need help getting started:
- Create an issue on GitHub
- Check the documentation
- Review the demo accounts for testing

## 🎉 Acknowledgments

- Built with ❤️ using React and Material UI
- Icons provided by Material UI Icons
- Inspired by modern URL shortening services
- Thanks to the open-source community

---

**Made with 💻 by Deepak** | [GitHub](https://github.com/Pawandasila) | [Project Repository](https://github.com/Pawandasila/url-shortner)
