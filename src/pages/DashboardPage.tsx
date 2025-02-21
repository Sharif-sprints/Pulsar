import React from 'react';
import { BarChart3, Package, DollarSign, Star, Users, TrendingUp } from 'lucide-react';
import type { Product, User } from '../types';

interface DashboardPageProps {
  user: User;
  products: Product[];
}

export function DashboardPage({ user, products }: DashboardPageProps) {
  const userProducts = products.filter(product => product.creator === user.name);
  const totalSales = userProducts.length * 3; // Mock data: assuming 3 sales per product
  const totalRevenue = userProducts.reduce((sum, product) => sum + (product.price * 3), 0);
  const averageRating = 4.5; // Mock data

  const stats = [
    { label: 'Total Products', value: userProducts.length, icon: Package },
    { label: 'Total Sales', value: totalSales, icon: TrendingUp },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: 'Average Rating', value: averageRating.toFixed(1), icon: Star },
    { label: 'Active Users', value: totalSales * 2, icon: Users }, // Mock data
  ];

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.name}!</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              Download Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-6 w-6 text-purple-400" />
                <BarChart3 className="h-4 w-4 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4">Recent Sales</h2>
            <div className="space-y-4">
              {userProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-400">3 sales</p>
                    </div>
                  </div>
                  <p className="font-bold">${(product.price * 3).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {userProducts.map(product => (
                <div key={product.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{product.title}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-600'}`}
                          fill={i < 4 ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    "Great automation tool! Saved me hours of work." - John Doe
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}