import React, { useState } from 'react';
import { Grid3X3, ListFilter, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

const MARKETPLACE_PRODUCTS: Product[] = [
  {
    id: '4',
    title: 'Pinterest Automation Suite',
    description: 'Automate your Pinterest marketing with AI-powered pin creation, scheduling, and analytics',
    price: 499,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80',
    creator: 'Social AI Labs',
    category: 'automation',
    tags: ['pinterest', 'social-media', 'marketing'],
    priceId: 'price_1P3GVJGk9bLuwZYPeXAtXyoEgX4zJqD8MA1jU04CGJ5DTGyLU9QVOp7zt0SLqreCTJ8PRGP194TxehsLagPYKVwf00wRA7hvqq',
    pulses: 156
  },
  {
    id: '5',
    title: 'Social Content Generator',
    description: 'AI-powered content creation for all major social media platforms',
    price: 299,
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80',
    creator: 'Content AI',
    category: 'automation',
    tags: ['content', 'social-media', 'ai'],
    priceId: 'price_1P3GVJGk9bLuwZYPeXAtXyoEgX4zJqD8MA1jU04CGJ5DTGyLU9QVOp7zt0SLqreCTJ8PRGP194TxehsLagPYKVwf00wRA7hvqq',
    pulses: 243
  },
  {
    id: '6',
    title: 'SEO Blog Agent',
    description: 'Automated blog post generation optimized for search engines',
    price: 599,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80',
    creator: 'SEO Masters',
    category: 'automation',
    tags: ['seo', 'blog', 'content'],
    priceId: 'price_1P3GVJGk9bLuwZYPeXAtXyoEgX4zJqD8MA1jU04CGJ5DTGyLU9QVOp7zt0SLqreCTJ8PRGP194TxehsLagPYKVwf00wRA7hvqq',
    pulses: 187
  },
  {
    id: '7',
    title: 'LinkedIn Engagement Bot',
    description: 'Automate your LinkedIn presence with AI-powered posts and engagement',
    price: 399,
    image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&q=80',
    creator: 'B2B AI Solutions',
    category: 'automation',
    tags: ['linkedin', 'b2b', 'networking'],
    priceId: 'price_1P3GVJGk9bLuwZYPeXAtXyoEgX4zJqD8MA1jU04CGJ5DTGyLU9QVOp7zt0SLqreCTJ8PRGP194TxehsLagPYKVwf00wRA7hvqq',
    pulses: 112
  },
  {
    id: '8',
    title: 'Email Marketing Assistant',
    description: 'AI-powered email campaign creation and optimization',
    price: 349,
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80',
    creator: 'Email AI',
    category: 'automation',
    tags: ['email', 'marketing', 'campaigns'],
    priceId: 'price_1P3GVJGk9bLuwZYPeXAtXyoEgX4zJqD8MA1jU04CGJ5DTGyLU9QVOp7zt0SLqreCTJ8PRGP194TxehsLagPYKVwf00wRA7hvqq',
    pulses: 98
  },
  {
    id: '9',
    title: 'Customer Support Bot',
    description: 'Intelligent chatbot for 24/7 customer support automation',
    price: 699,
    image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80',
    creator: 'Support AI',
    category: 'automation',
    tags: ['support', 'chatbot', 'customer-service'],
    priceId: 'price_1P3GVJGk9bLuwZYPeXAtXyoEgX4zJqD8MA1jU04CGJ5DTGyLU9QVOp7zt0SLqreCTJ8PRGP194TxehsLagPYKVwf00wRA7hvqq',
    pulses: 176
  },
  {
    id: 'prod_RoVaIw6Z764B8B',
    title: 'AI Document Processor',
    description: 'Automatically process and analyze documents using advanced AI',
    price: 299,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80',
    creator: 'AI Labs',
    category: 'automation',
    tags: ['document', 'processing', 'ai'],
    priceId: 'price_1P3GVJGk9bLuwZYPeXAtXyoEgX4zJqD8MA1jU04CGJ5DTGyLU9QVOp7zt0SLqreCTJ8PRGP194TxehsLagPYKVwf00wRA7hvqq',
    pulses: 124
  },
  {
    id: 'prod_RoVbXy7Z764C9D',
    title: 'AI Video Generator',
    description: 'Create professional videos from text prompts with cutting-edge AI technology',
    price: 499,
    image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&q=80',
    creator: 'VideoAI',
    category: 'workflow',
    tags: ['video', 'generation', 'content'],
    priceId: 'price_1P3GVJGk9bLuwZYPeXAtXyoEgX4zJqD8MA1jU04CGJ5DTGyLU9QVOp7zt0SLqreCTJ8PRGP194TxehsLagPYKVwf00wRA7hvqq',
    pulses: 287
  },
  {
    id: 'prod_RoVcZz8Z764D0E',
    title: 'Customer Support AI',
    description: 'Intelligent chatbot that handles customer inquiries 24/7 with natural language processing',
    price: 199,
    image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80',
    creator: 'SupportTech',
    category: 'integration',
    tags: ['support', 'chatbot', 'customer-service'],
    priceId: 'price_1P3GVJGk9bLuwZYPeXAtXyoEgX4zJqD8MA1jU04CGJ5DTGyLU9QVOp7zt0SLqreCTJ8PRGP194TxehsLagPYKVwf00wRA7hvqq',
    pulses: 93
  }
];

export function MarketplacePage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'price' | 'pulses'>('popular');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const categories = ['all', 'social-media', 'content', 'marketing', 'support'];

  const filteredProducts = MARKETPLACE_PRODUCTS.filter(product => 
    selectedCategory === 'all' || product.tags.includes(selectedCategory)
  );

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.pulses - a.pulses;
      case 'recent':
        // For demo purposes, we'll just use the ID as a proxy for recency
        return b.id.localeCompare(a.id);
      case 'price':
        return a.price - b.price;
      case 'pulses':
        return b.pulses - a.pulses;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-gray-400">Discover powerful AI automations</p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg ${
                  view === 'grid' ? 'bg-purple-600' : 'bg-gray-800'
                }`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg ${
                  view === 'list' ? 'bg-purple-600' : 'bg-gray-800'
                }`}
              >
                <ListFilter className="h-5 w-5" />
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Recently Added</option>
              <option value="price">Price: Low to High</option>
              <option value="pulses">Most Pulses</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 space-y-4">
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      selectedCategory === category
                        ? 'bg-purple-600'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <input
                type="range"
                min="0"
                max="1000"
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between mt-2">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Pulse Rating</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center justify-between">
                  <span>High Rated</span>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <Zap className="h-4 w-4 text-yellow-400" />
                  </div>
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center justify-between">
                  <span>Medium Rated</span>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <Zap className="h-4 w-4 text-yellow-400" />
                  </div>
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center justify-between">
                  <span>Low Rated</span>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-yellow-400" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className={`grid gap-6 ${
              view === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer ${
                    view === 'list' ? 'flex' : ''
                  }`}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className={`relative ${view === 'list' ? 'w-48' : 'aspect-video'}`}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-2">
                        {product.tags.slice(0, 1).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">{product.pulses}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-white">${product.price}</span>
                        <p className="text-sm text-gray-400">by {product.creator}</p>
                      </div>
                      <button 
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}