import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import type { User, Notification } from '../types';

interface NotificationCenterProps {
  user: User | null;
}

export function NotificationCenter({ user }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    getNotificationsForUser 
  } = useNotifications();
  
  const userNotifications = getNotificationsForUser(user);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'admin':
        return 'bg-purple-500';
      case 'creator':
        return 'bg-blue-500';
      case 'buyer':
        return 'bg-green-500';
      case 'system':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg relative"
      >
        <Bell className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="p-1 hover:bg-gray-800 rounded-full"
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4 text-gray-400" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-800 rounded-full"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {userNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No notifications
              </div>
            ) : (
              userNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${
                    !notification.read ? 'bg-gray-800/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationTypeColor(notification.type)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-gray-400">{formatTime(notification.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="p-1 hover:bg-gray-700 rounded-full"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}