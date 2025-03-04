import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Filter, ChevronDown, ChevronUp, MoreHorizontal,
  UserPlus, Mail, Shield, Ban, Eye, Download, Trash, Edit
} from 'lucide-react';
import type { AuthState } from '../types';

interface AdminUsersPageProps {
  auth: AuthState;
}

// Sample users for demonstration
const SAMPLE_USERS = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john.doe@example.com',
    role: 'user',
    status: 'active',
    workflows: 3,
    purchases: 12,
    revenue: 1245,
    joinedAt: '2025-01-15T10:30:00Z'
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com',
    role: 'user',
    status: 'active',
    workflows: 5,
    purchases: 8,
    revenue: 2340,
    joinedAt: '2025-02-20T14:45:00Z'
  },
  { 
    id: '3', 
    name: 'Admin User', 
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    workflows: 0,
    purchases: 0,
    revenue: 0,
    joinedAt: '2024-12-01T09:00:00Z'
  },
  { 
    id: '4', 
    name: 'Bob Johnson', 
    email: 'bob.johnson@example.com',
    role: 'user',
    status: 'inactive',
    workflows: 1,
    purchases: 5,
    revenue: 895,
    joinedAt: '2025-03-10T11:20:00Z'
  },
  { 
    id: '5', 
    name: 'Alice Williams', 
    email: 'alice.williams@example.com',
    role: 'user',
    status: 'active',
    workflows: 8,
    purchases: 3,
    revenue: 3450,
    joinedAt: '2025-01-05T16:15:00Z'
  },
  { 
    id: '6', 
    name: 'Charlie Brown', 
    email: 'charlie.brown@example.com',
    role: 'user',
    status: 'suspended',
    workflows: 2,
    purchases: 7,
    revenue: 1120,
    joinedAt: '2025-02-28T13:40:00Z'
  },
  { 
    id: '7', 
    name: 'Diana Prince', 
    email: 'diana.prince@example.com',
    role: 'user',
    status: 'active',
    workflows: 6,
    purchases: 15,
    revenue: 4230,
    joinedAt: '2024-12-15T10:10:00Z'
  },
  { 
    id: '8', 
    name: 'Ethan Hunt', 
    email: 'ethan.hunt@example.com',
    role: 'user',
    status: 'active',
    workflows: 4,
    purchases: 9,
    revenue: 1875,
    joinedAt: '2025-03-05T09:30:00Z'
  }
];

export function AdminUsersPage({ auth }: AdminUsersPageProps) {
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUser, setSelectedUser] = useState<typeof SAMPLE_USERS[0] | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if not admin
  if (!auth.user || auth.user.role !== 'admin') {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-red-900/30 p-8 rounded-xl border border-red-800 max-w-md text-center">
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users based on selected sort option
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      case 'oldest':
        return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'revenue-high':
        return b.revenue - a.revenue;
      case 'revenue-low':
        return a.revenue - b.revenue;
      default:
        return 0;
    }
  });

  const toggleActionMenu = (userId: string) => {
    setShowActionMenu(showActionMenu === userId ? null : userId);
  };

  const handleUserAction = (action: string, userId: string) => {
    // In a real app, these actions would call API endpoints
    switch (action) {
      case 'view':
        const user = users.find(u => u.id === userId);
        if (user) {
          setSelectedUser(user);
          setShowUserModal(true);
        }
        break;
      case 'edit':
        // Navigate to edit user page or show edit modal
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this user?')) {
          setUsers(users.filter(u => u.id !== userId));
        }
        break;
      case 'suspend':
        setUsers(users.map(u => 
          u.id === userId ? { ...u, status: 'suspended' } : u
        ));
        break;
      case 'activate':
        setUsers(users.map(u => 
          u.id === userId ? { ...u, status: 'active' } : u
        ));
        break;
      case 'promote':
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: 'admin' } : u
        ));
        break;
      case 'demote':
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: 'user' } : u
        ));
        break;
    }
    setShowActionMenu(null);
  };

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">Inactive</span>;
      case 'suspended':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Suspended</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-400">Manage platform users and their permissions</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Add User
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-purple-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="revenue-high">Revenue (High-Low)</option>
              <option value="revenue-low">Revenue (Low-High)</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            <button className="px-3 py-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-900 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Workflows</th>
                  <th className="text-right py-3 px-4">Purchases</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                  <th className="text-right py-3 px-4">Joined</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.role === 'admin' ? (
                        <span className="flex items-center gap-1 text-purple-400">
                          <Shield className="h-3 w-3" /> Admin
                        </span>
                      ) : (
                        <span>User</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {getUserStatusBadge(user.status)}
                    </td>
                    <td className="text-right py-3 px-4">{user.workflows}</td>
                    <td className="text-right py-3 px-4">{user.purchases}</td>
                    <td className="text-right py-3 px-4">${user.revenue}</td>
                    <td className="text-right py-3 px-4">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="text-right py-3 px-4 relative">
                      <button
                        onClick={() => toggleActionMenu(user.id)}
                        className="p-1 hover:bg-gray-700 rounded-full"
                      >
                        <MoreHorizontal className="h-5 w-5 text-gray-400" />
                      </button>
                      
                      {showActionMenu === user.id && (
                        <div className="absolute right-4 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => handleUserAction('view', user.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 rounded-t-lg"
                          >
                            <Eye className="h-4 w-4 text-gray-400" /> View Details
                          </button>
                          <button
                            onClick={() => handleUserAction('edit', user.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4 text-gray-400" /> Edit User
                          </button>
                          <button
                            onClick={() => handleUserAction('email', user.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Mail className="h-4 w-4 text-gray-400" /> Send Email
                          </button>
                          
                          <div className="border-t border-gray-700 my-1"></div>
                          
                          {user.role === 'user' ? (
                            <button
                              onClick={() => handleUserAction('promote', user.id)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                            >
                              <Shield className="h-4 w-4 text-purple-400" /> Make Admin
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction('demote', user.id)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                            >
                              <Shield className="h-4 w-4 text-gray-400" /> Remove Admin
                            </button>
                          )}
                          
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleUserAction('suspend', user.id)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                            >
                              <Ban className="h-4 w-4 text-red-400" /> Suspend User
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction('activate', user.id)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                            >
                              <Ban className="h-4 w-4 text-green-400" /> Activate User
                            </button>
                          )}
                          
                          <div className="border-t border-gray-700 my-1"></div>
                          
                          <button
                            onClick={() => handleUserAction('delete', user.id)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 text-red-400 rounded-b-lg"
                          >
                            <Trash className="h-4 w-4" /> Delete User
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No users found matching your filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              1
            </button>
            <button className="px-3 py-1 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
              3
            </button>
            <button className="px-3 py-1 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl w-full max-w-2xl relative border border-gray-800">
            <button
              onClick={() => setShowUserModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <ChevronDown className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                <p className="text-gray-400">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {selectedUser.role === 'admin' && (
                    <span className="flex items-center gap-1 text-purple-400 text-sm">
                      <Shield className="h-3 w-3" /> Admin
                    </span>
                  )}
                  {getUserStatusBadge(selectedUser.status)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Joined</p>
                  <p className="font-medium">{new Date(selectedUser.joinedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Workflows Created</p>
                  <p className="font-medium">{selectedUser.workflows}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Purchases</p>
                  <p className="font-medium">{selectedUser.purchases}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                  <p className="font-medium">${selectedUser.revenue}</p>
                </div>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="text-gray-300">Purchased "Email Marketing Automation"</p>
                    <p className="text-gray-500">2 days ago</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-300">Updated profile information</p>
                    <p className="text-gray-500">5 days ago</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-300">Submitted new workflow</p>
                    <p className="text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 transition-colors flex items-center justify-center gap-2">
                <Edit className="h-4 w-4" /> Edit User
              </button>
              <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2 transition-colors flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" /> Send Email
              </button>
              {selectedUser.status === 'active' ? (
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 transition-colors flex items-center justify-center gap-2">
                  <Ban className="h-4 w-4" /> Suspend
                </button>
              ) : (
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 transition-colors flex items-center justify-center gap-2">
                  <Ban className="h-4 w-4" /> Activate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}