import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('cognibridge-theme');
    return savedTheme === 'dark';
  });

  // Apply theme to document body and save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.className = 'bg-dark text-white';
      document.body.style.backgroundColor = '#212529';
      document.body.style.color = '#ffffff';
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.documentElement.style.backgroundColor = '#212529';
      localStorage.setItem('cognibridge-theme', 'dark');
    } else {
      document.body.className = 'bg-light text-dark';
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#212529';
      document.documentElement.setAttribute('data-bs-theme', 'light');
      document.documentElement.style.backgroundColor = '#f8f9fa';
      localStorage.setItem('cognibridge-theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const value = {
    darkMode,
    toggleTheme,
    theme: {
      // Background colors
      bg: darkMode ? 'bg-dark' : 'bg-light',
      bgSecondary: darkMode ? 'bg-secondary' : 'bg-white',
      bgPage: darkMode ? '#212529' : '#f8f9fa',
      
      // Text colors
      text: darkMode ? 'text-white' : 'text-dark',
      textMuted: darkMode ? 'text-light' : 'text-muted',
      
      // Card styles
      card: darkMode ? 'bg-dark border-secondary text-white' : 'bg-white',
      cardHeader: darkMode ? 'bg-secondary text-white' : 'bg-primary text-white',
      
      // Button styles
      btnPrimary: 'btn-primary',
      btnSecondary: darkMode ? 'btn-outline-light' : 'btn-outline-secondary',
      btnSuccess: 'btn-success',
      btnWarning: 'btn-warning',
      btnDanger: 'btn-danger',
      btnInfo: 'btn-info',
      
      // Form styles
      formControl: darkMode ? 'form-control bg-dark text-white border-secondary' : 'form-control',
      formLabel: darkMode ? 'form-label text-white' : 'form-label',
      
      // Navbar styles
      navbar: darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light',
      
      // Table styles
      table: darkMode ? 'table table-dark table-hover' : 'table table-hover',
      
      // Alert styles
      alertInfo: darkMode ? 'alert alert-info bg-dark border-info text-info' : 'alert alert-info',
      alertSuccess: darkMode ? 'alert alert-success bg-dark border-success text-success' : 'alert alert-success',
      alertDanger: darkMode ? 'alert alert-danger bg-dark border-danger text-danger' : 'alert alert-danger',
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
