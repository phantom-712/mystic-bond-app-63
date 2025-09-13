import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'match' | 'message' | 'reveal' | 'like' | 'post' | 'announcement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
  avatar?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'match',
      title: 'New Connection!',
      message: 'You have a new connection waiting to chat',
      timestamp: '2 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'Luna sent you a message',
      timestamp: '5 min ago',
      read: false,
      userId: '1',
    },
    {
      id: '3',
      type: 'reveal',
      title: 'Identity Revealed!',
      message: 'Phoenix has revealed their identity to you',
      timestamp: '1 hour ago',
      read: true,
      userId: '2',
    },
    {
      id: '4',
      type: 'announcement',
      title: 'App Update',
      message: 'New features are now available! Check out the enhanced chat experience.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '5',
      type: 'like',
      title: 'Someone liked your post',
      message: 'Your recent post received a like',
      timestamp: '3 hours ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: 'now',
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };
};