import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, LogIn, UserPlus, Shield, HelpCircle } from 'lucide-react';
import type { AuthState } from '../types';

interface UserDropdownProps {
  auth: AuthState;
  onSignOut: () => void;
  onAuthClick: () => void;
}

export function UserDropdown({ auth, onSignOut, onAuthClick }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    onSignOut();
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 hover:bg-gray-800 rounded-lg group relative"
        title={auth.isAuthenticated ? 'Account' : 'Sign In'}
      >
        <User className="h-5 w-5 text-gray-300" />
        {auth.isAuthenticated && (
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-lg z-50 overflow-hidden">
          {auth.isAuthenticated ? (
            <>
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {auth.user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{auth.user?.name}</p>
                    <p className="text-sm text-gray-400">{auth.user?.email}</p>
                  </div>
                </div>
                {auth.user?.role === 'admin' && (
                  <div className="mt-2 flex items-center">
                    <Shield className="h-4 w-4 text-purple-400 mr-1" />
                    <span className="text-xs text-purple-400">Admin</span>
                  </div>
                )}
              </div>
              <div className="py-2">
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center space-x-3"
                >
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigation('/settings')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center space-x-3"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  <span>Settings</span>
                </button>
                {auth.user?.role === 'admin' && (
                  <button
                    onClick={() => handleNavigation('/admin')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center space-x-3"
                  >
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span>Admin Panel</span>
                  </button>
                )}
                <div className="border-t border-gray-800 my-2"></div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center space-x-3 text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-2">
              <button
                onClick={onAuthClick}
                className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center space-x-3"
              >
                <LogIn className="h-4 w-4 text-gray-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={onAuthClick}
                className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center space-x-3"
              >
                <UserPlus className="h-4 w-4 text-gray-400" />
                <span>Create Account</span>
              </button>
              <div className="border-t border-gray-800 my-2"></div>
              <button
                onClick={() => handleNavigation('/help')}
                className="w-full text-left px-4 py-2 hover:bg-gray-800 flex items-center space-x-3"
              >
                <HelpCircle className="h-4 w-4 text-gray-400" />
                <span>Help & Support</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}