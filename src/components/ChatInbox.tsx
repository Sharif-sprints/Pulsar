import React, { useState } from 'react';
import { X, Search, MessageCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample chat data
const SAMPLE_CHATS = [
  {
    id: 'chat1',
    productId: 'prod_RoVaIw6Z764B8B',
    productTitle: 'AI Document Processor',
    creatorName: 'AI Labs',
    lastMessage: "I've sent you a proposal for the customization work.",
    timestamp: '2025-06-15T14:30:00Z',
    unread: true
  },
  {
    id: 'chat2',
    productId: 'prod_RoVbXy7Z764C9D',
    productTitle: 'AI Video Generator',
    creatorName: 'VideoAI',
    lastMessage: "I've sent you a proposal for the customization work.",
    timestamp: '2025-06-14T09:15:00Z',
    unread: true
  },
  {
    id: 'chat3',
    productId: 'prod_RoVcZz8Z764D0E',
    productTitle: 'Customer Support AI',
    creatorName: 'SupportTech',
    lastMessage: 'The implementation is complete. Please review and let me know if you need any adjustments.',
    timestamp: '2025-06-10T16:45:00Z',
    unread: false
  }
];

interface ChatInboxProps {
  onClose: () => void;
}

export function ChatInbox({ onClose }: ChatInboxProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredChats = SAMPLE_CHATS.filter(chat => 
    chat.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleChatClick = (chatId: string, productId: string) => {
    // In a real app, this would navigate to the chat page or open the chat modal
    navigate(`/product/${productId}`);
    onClose();
  };

  return (
    <div className="absolute right-0 top-12 w-80 md:w-96 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="font-semibold">Messages</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-800 rounded-full"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-9 focus:outline-none focus:border-purple-500 text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-500" />
            <p>No messages found</p>
          </div>
        ) : (
          filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat.id, chat.productId)}
              className={`p-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${
                chat.unread ? 'bg-gray-800/50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold">
                    {chat.creatorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{chat.creatorName}</h4>
                    <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(chat.timestamp)}</span>
                  </div>
                  <p className="text-xs text-purple-400 mb-1 truncate">{chat.productTitle}</p>
                  <p className="text-sm text-gray-300 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread && (
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-gray-800">
        <button className="w-full py-2 text-sm text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1">
          View All Messages <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}