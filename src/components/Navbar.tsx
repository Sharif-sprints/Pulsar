import React from 'react';
import { Search, ShoppingCart, Upload, User, Home } from 'lucide-react';
import type { AuthState } from '../types';

interface NavbarProps {
  auth: AuthState;
  onAuthClick: () => void;
  onUploadClick: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onHome: () => void;
}

export function Navbar({ auth, onAuthClick, onUploadClick, onSearch, searchQuery, onHome }: NavbarProps) {
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
              onClick={onHome}
              className="p-2 hover:bg-gray-800 rounded-lg"
              title="Home"
            >
              <Home className="h-5 w-5 text-gray-300" />
            </button>
            <button
              onClick={onUploadClick}
              className="p-2 hover:bg-gray-800 rounded-lg"
              title="Upload Tool"
            >
              <Upload className="h-5 w-5 text-gray-300" />
            </button>
            <button
              className="p-2 hover:bg-gray-800 rounded-lg"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5 text-gray-300" />
            </button>
            <button
              onClick={onAuthClick}
              className="p-2 hover:bg-gray-800 rounded-lg group relative"
              title={auth.isAuthenticated ? 'Dashboard' : 'Sign In'}
            >
              <User className="h-5 w-5 text-gray-300" />
              {auth.isAuthenticated && (
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}