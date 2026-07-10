import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const NotificationContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get(`${API_URL}/notifications`);
      if (res.data.success) {
        setNotifications(res.data.data);
        // Simple client simulation of read/unread count
        setUnreadCount(res.data.data.length);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const addNotification = async (title, message, type, targetRole, department) => {
    try {
      const res = await axios.post(`${API_URL}/notifications`, {
        title,
        message,
        type,
        targetRole,
        department,
      });
      if (res.data.success) {
        setNotifications((prev) => [res.data.data, ...prev]);
        setUnreadCount((prev) => prev + 1);
        return { success: true };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const clearUnread = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, fetchNotifications, addNotification, clearUnread }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
