import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const NotificationContext = createContext();

const STORAGE_KEY = "crm_notifications";


const loadFromStorage = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);

            return parsed.map(n => ({
                ...n,
                timestamp: new Date(n.timestamp)
            }));
        }
    } catch (error) {
        console.error("Error loading notifications from localStorage:", error);
    }
    return [];
};


const saveToStorage = (notifications) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
        console.error("Error saving notifications to localStorage:", error);
    }
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within NotificationProvider");
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => loadFromStorage());


    useEffect(() => {
        saveToStorage(notifications);
    }, [notifications]);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(),
            timestamp: new Date(),
            read: false,
            ...notification,
        };
        setNotifications((prev) => [newNotification, ...prev]);
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const clearNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotification,
                clearAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;

