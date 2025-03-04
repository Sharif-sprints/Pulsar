import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (email: string, password: string, isSignUp: boolean) => void;
}

export function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth(email, password, isSignUp);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md relative border border-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Use an email with "admin" to access the admin panel
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 px-4 transition-colors"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-purple-400 hover:text-purple-300"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}