// Context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'user-theme-mode'; // AsyncStorage key

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [loading, setLoading] = useState(true); // to prevent flashing

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeMode(savedTheme);
          if (savedTheme === 'light') setIsDark(false);
          else if (savedTheme === 'dark') setIsDark(true);
          else setIsDark(systemColorScheme === 'dark');
        } else {
          // default to system if not set
          setThemeMode('system');
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (e) {
        console.error('Error loading theme:', e);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Listen to system theme changes if themeMode === 'system'
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system') {
        setIsDark(colorScheme === 'dark');
      }
    });
    return () => listener.remove();
  }, [themeMode]);

  // Apply theme when themeMode changes
  useEffect(() => {
    if (themeMode === 'light') setIsDark(false);
    else if (themeMode === 'dark') setIsDark(true);
    else setIsDark(Appearance.getColorScheme() === 'dark');

    AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode).catch(err =>
      console.error('Error saving theme:', err)
    );
  }, [themeMode]);

  // Toggle between modes in order: light → dark → system → light...
  const toggleTheme = () => {
    setThemeMode(prev =>
      prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light'
    );
  };

  const colors = {
    background: isDark ? '#121212' : '#ffffff',
    text: isDark ? '#ffffff' : '#000000',
    card: isDark ? '#1e1e1e' : '#f5f5f5ff',
    border: isDark ? '#444' : '#ddd',
    highlight: '#5aff62ff',
    secText: '#dcdcdcff',
    error:'#ff3b3bff',
  };
// 5aff62ff
// 001effff
  if (loading) return null; // avoid flash of wrong theme

  return (
    <ThemeContext.Provider
      value={{ isDark, themeMode, toggleTheme, setThemeMode, colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
