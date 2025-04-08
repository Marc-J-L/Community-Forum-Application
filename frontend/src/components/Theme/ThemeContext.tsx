// ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create the context
const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
});

// Custom hook to use the ThemeContext
export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Get initial theme from local storage or default to light mode
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  // Function to dynamically load a CSS file
  const loadCSS = (href: string) => {
    const existingLink = document.querySelector('link[data-theme]');
    if (existingLink) {
      existingLink.setAttribute('href', href);
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('data-theme', 'true');
      link.setAttribute('href', href);
      document.head.appendChild(link);
    }
  };

  useEffect(() => {
    if (darkMode) {
      loadCSS('../../style/dark.css'); // Adjust the path as needed
    } else {
      loadCSS('../../style/light.css'); // Adjust the path as needed
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Ensure to export ThemeContext as default
export default ThemeContext;