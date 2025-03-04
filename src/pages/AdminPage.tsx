import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, XCircle, Clock, Filter, Search, Eye, ArrowUpDown, 
  BarChart3, Users, Package, DollarSign, TrendingUp, Zap, 
  FileText, Settings, Bell
} from 'lucide-react';
import type { Workflow, User, AuthState } from '../types';

interface AdminPageProps {
  auth: AuthState;
}

// Sample workflows for demonstration
const SAMPLE_WORKFLOWS: Workflow[] = [
  {
    id: 'wf1',
    title: 'Email Marketing Automation',
    description: 'Automate your email marketing campaigns with AI-powered content generation and scheduling',
    price: 299,
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80',
    creator: 'marketing_guru',
    category: 'automation',
    tags: ['email', 'marketing', 'automation'],
    status: 'pending',
    submittedAt: '2025-06-10T14:30:00Z',
  },
  {
    id: 'wf2',
    title: 'Social Media Content Generator',
    description: 'Generate engaging social media content across multiple platforms with one click',
    price: 199,
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80',
    creator: 'social_ai',
    category: 'automation',
    tags: ['social-media', 'content', 'ai'],
    status: 'approved',
    submittedAt: '2025-06-08T09:15:00Z',
    reviewedAt: '2025-06-09T11:20:00Z',
    reviewedBy: 'admin',
  },
  {
    id: 'wf3',
    title: 'Customer Support Chatbot',
    description: 'AI-powered chatbot for 24/7 customer support with natural language processing',
    price: 499,
    image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80',
    creator: 'support_ai',
    category: 'integration',
    tags: ['chatbot', 'support', 'ai'],
    status: 'rejected',
    submittedAt: '2025-06-07T16:45:00Z',
    reviewedAt: '2025-06-09T10:30:00Z',
    reviewedBy: 'admin',
    rejectionReason: 'Similar product already exists. Please differentiate your offering.',
  },
  {
    id: 'wf4',
    title: 'SEO Content Optimizer',
    description: 'Optimize your content for search engines with AI-powered recommendations',
    price: 349,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80',
    creator: 'seo_master',
    category: 'workflow',
    tags: ['seo', 'content', 'optimization'],
    status: 'pending',
    submittedAt: '2025-06-09T13:20:00Z',
  },
];

export function AdminPage({ auth }: AdminPageProps) {
  const navigate = useNavigate();

  // Redirect if not admin
  if (!auth.user || auth.user.role !== 'admin') {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-red-900/30 p-8 rounded-xl border border-red-800 max-w-md text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 px-8 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Admin dashboard stats
  const stats = [
    { label: 'Total Users', value: '1,245', icon: Users, change: '+12%', color: 'from-blue-500 to-blue-700' },
    { label: 'Total Workflows', value: '328', icon: Package, change: '+8%', color: 'from-purple-500 to-purple-700' },
    { label: 'Revenue', value: '$48,290', icon: DollarSign, change: '+24%', color: 'from-green-500 to-green-700' },
    { label: 'Pending Reviews', value: '12', icon: Clock, change: '-3%', color: 'from-yellow-500 to-yellow-700' }
  ];

  // Admin menu items
  const menuItems = [
    { label: 'Dashboard', icon: BarChart3, path: '/admin' },
    { label: 'Workflow Curation', icon: FileText, path: '/admin/curation' },
    { label: 'User Management', icon: Users, path: '/admin/users' },
    { label: 'Statistics', icon: TrendingUp, path: '/admin/stats' },
    { label: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {auth.user.name}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2">
              <Zap className="h-4 w-4" /> Quick Actions
            </button>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                item.path === '/admin' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-900 hover:bg-gray-800 text-gray-300'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className={`text-sm ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Submissions */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Submissions</h2>
              <button 
                onClick={() => navigate('/admin/curation')}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {SAMPLE_WORKFLOWS.filter(w => w.status === 'pending').slice(0, 3).map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => navigate('/admin/curation')}
                >
                  <img
                    src={workflow.image}
                    alt={workflow.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{workflow.title}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>By {workflow.creator}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(workflow.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Workflows */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Top Selling Workflows</h2>
              <button 
                onClick={() => navigate('/admin/stats')}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {SAMPLE_WORKFLOWS.filter(w => w.status === 'approved').slice(0, 3).map((workflow, index) => (
                <div
                  key={workflow.id}
                  className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <img
                    src={workflow.image}
                    alt={workflow.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{workflow.title}</h3>
                    <p className="text-sm text-gray-400">${workflow.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{Math.floor(Math.random() * 100) + 10} sales</p>
                    <p className="text-sm text-green-400">+{Math.floor(Math.random() * 30) + 5}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <button className="text-sm text-purple-400 hover:text-purple-300">
              View All
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>
            
            <div className="space-y-6">
              {[
                { action: 'New user registered', user: 'john_doe', time: '10 minutes ago', icon: Users },
                { action: 'Workflow approved', user: 'admin', workflow: 'Social Media Content Generator', time: '1 hour ago', icon: CheckCircle },
                { action: 'New workflow submitted', user: 'ai_creator', workflow: 'Customer Data Analysis Tool', time: '3 hours ago', icon: FileText },
                { action: 'Workflow rejected', user: 'admin', workflow: 'Basic Text Generator', time: '5 hours ago', icon: XCircle },
                { action: 'New sale', user: 'customer123', workflow: 'Email Marketing Automation', time: '1 day ago', icon: DollarSign }
              ].map((activity, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute left-2 top-1 w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center -ml-3">
                    <activity.icon className="h-3 w-3 text-gray-400" />
                  </div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-400">
                    {activity.workflow ? (
                      <>
                        <span className="text-purple-400">{activity.user}</span> - {activity.workflow}
                      </>
                    ) : (
                      <span className="text-purple-400">{activity.user}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}