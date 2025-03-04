import React, { useState } from 'react';
import { Search, ShoppingCart, PlusCircle, MessageCircle } from 'lucide-react';
import { UserDropdown } from './UserDropdown';
import { ChatInbox } from './ChatInbox';
import { NotificationCenter } from './NotificationCenter';
import type { AuthState } from '../types';

interface NavbarProps {
  auth: AuthState;
  onAuthClick: () => void;
  onUploadClick: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onHome: () => void;
  onSignOut?: () => void;
}

export function Navbar({ 
  auth, 
  onAuthClick, 
  onUploadClick, 
  onSearch, 
  searchQuery, 
  onHome,
  onSignOut = () => {} 
}: NavbarProps) {
  const [showChatInbox, setShowChatInbox] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={onHome} className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Pulsar
            </button>
          </div>
          
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search AI tools..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-purple-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onUploadClick}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              title="Submit AI Workflow"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Submit AI Workflow</span>
            </button>
            
            <button
              className="p-2 hover:bg-gray-800 rounded-lg"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5 text-gray-300" />
            </button>
            
            {auth.isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowChatInbox(!showChatInbox);
                    setShowNotifications(false);
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg relative"
                  title="Messages"
                >
                  <MessageCircle className="h-5 w-5 text-gray-300" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    2
                  </span>
                </button>
                {showChatInbox && (
                  <ChatInbox onClose={() => setShowChatInbox(false)} />
                )}
              </div>
            )}
            
            {auth.isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowChatInbox(false);
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg relative"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5 text-gray-300" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </button>
                {showNotifications && (
                  <NotificationDropdown 
                    user={auth.user} 
                    onClose={() => setShowNotifications(false)} 
                  />
                )}
              </div>
            )}
            
            <UserDropdown 
              auth={auth} 
              onSignOut={onSignOut} 
              onAuthClick={onAuthClick} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Bell icon component
function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

// Notification dropdown component
import { useNotifications } from '../context/NotificationContext';
import { Check, CheckCheck, X } from 'lucide-react';

function NotificationDropdown({ user, onClose }: { user: UserType | null, onClose: () => void }) {
  const { 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    getNotificationsForUser 
  } = useNotifications();
  
  const userNotifications = getNotificationsForUser(user);

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
    <div className="absolute right-0 top-12 w-80 md:w-96 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
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
            onClick={onClose}
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
  );
}