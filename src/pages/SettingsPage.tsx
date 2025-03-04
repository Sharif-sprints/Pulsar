import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Bell, CreditCard, Shield, Save } from 'lucide-react';
import type { User as UserType } from '../types';

interface SettingsPageProps {
  user: UserType | null;
}

export function SettingsPage({ user }: SettingsPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false
  });

  // Redirect if not logged in
  if (!user) {
    navigate('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the settings to a backend
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'api', label: 'API Access', icon: Shield }
  ];

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64">
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                    activeTab === tab.id 
                      ? 'bg-purple-600 text-white' 
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500 h-32"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 px-6 transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </form>
              )}
              
              {activeTab === 'security' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">Security Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="twoFactorAuth"
                      name="twoFactorAuth"
                      checked={formData.twoFactorAuth}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                    />
                    <label htmlFor="twoFactorAuth" className="ml-2 block text-sm">
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 px-6 transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </form>
              )}
              
              {activeTab === 'notifications' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-400">Receive notifications about your account activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="emailNotifications"
                          checked={formData.emailNotifications}
                          onChange={handleChange}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing Emails</h3>
                        <p className="text-sm text-gray-400">Receive updates about new features and promotions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="marketingEmails"
                          checked={formData.marketingEmails}
                          onChange={handleChange}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 px-6 transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </form>
              )}
              
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">Billing Information</h2>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Current Plan</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold">Free Plan</p>
                        <p className="text-sm text-gray-400">Basic access to the platform</p>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                        Upgrade
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Payment Methods</h3>
                    <p className="text-gray-400">No payment methods added yet.</p>
                    <button className="mt-2 text-purple-400 hover:text-purple-300 text-sm">
                      + Add Payment Method
                    </button>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Billing History</h3>
                    <p className="text-gray-400">No billing history available.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-4">API Access</h2>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">API Keys</h3>
                    <div className="flex items-center justify-between">
                      <div className="font-mono bg-gray-900 p-2 rounded text-sm flex-1 mr-4 overflow-x-auto">
                        sk_test_••••••••••••••••••••••••••••••
                      </div>
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors whitespace-nowrap">
                        Reveal Key
                      </button>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button className="text-purple-400 hover:text-purple-300 text-sm">
                        + Generate New Key
                      </button>
                      <button className="text-red-400 hover:text-red-300 text-sm">
                        Revoke Key
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">API Documentation</h3>
                    <p className="text-gray-400 mb-2">
                      Learn how to integrate with our API to build custom solutions.
                    </p>
                    <a 
                      href="#" 
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      View Documentation →
                    </a>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">API Usage</h3>
                    <p className="text-gray-400">
                      You have made 0 API requests this month.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}