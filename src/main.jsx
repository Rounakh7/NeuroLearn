import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/global.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AuthProvider } from './hooks/useAuth.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { initializeTherapyData } from './utils/initializeTherapyData.js'

// Initialize therapy data on app start
initializeTherapyData();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
