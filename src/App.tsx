import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { AuthModal } from './components/AuthModal';
import { UploadPage } from './pages/UploadPage';
import { DashboardPage } from './pages/DashboardPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { SuccessPage } from './pages/SuccessPage';
import { EnvCheck } from './pages/EnvCheck';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { AdminCurationPage } from './pages/AdminCurationPage';
import { AdminStatsPage } from './pages/AdminStatsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { NotificationProvider } from './context/NotificationContext';
import { ProductDetailPage } from './pages/ProductDetailPage';
import type { Product, AuthState } from './types';
import Cancel from './pages/Cancel';

const SAMPLE_PRODUCTS: Product[] = [
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

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState<'latest' | 'popular' | 'trending'>('popular');
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });
  const navigate = useNavigate();

  // Check for saved auth state on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuth(parsedAuth);
      } catch (error) {
        console.error('Failed to parse saved auth state:', error);
        localStorage.removeItem('authState');
      }
    }
  }, []);

  // Save auth state to localStorage when it changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem('authState', JSON.stringify(auth));
    } else {
      localStorage.removeItem('authState');
    }
  }, [auth]);

  const handleAuth = (email: string, password: string, isSignUp: boolean) => {
    // For demo purposes, set admin role for specific email
    const isAdmin = email.includes('admin');
    
    setAuth({
      isAuthenticated: true,
      user: {
        id: '1',
        name: email.split('@')[0],
        email,
        products: [],
        role: isAdmin ? 'admin' : 'user'
      }
    });
    setShowAuthModal(false);
    navigate('/dashboard');
  };

  const handleSignOut = () => {
    setAuth({
      isAuthenticated: false,
      user: null
    });
    navigate('/');
  };

  const handleUploadClick = () => {
    if (!auth.isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate('/upload');
    }
  };

  const handleProductSubmit = (newProduct: Omit<Product, 'id' | 'creator' | 'pulses'>) => {
    const productWithId: Product = {
      ...newProduct,
      id: Date.now().toString(),
      creator: auth.user?.name || 'Anonymous',
      pulses: 0
    };
    setProducts(prev => [productWithId, ...prev]);
    navigate('/marketplace');
  };

  const handleProfileClick = () => {
    if (auth.isAuthenticated) {
      // If user is admin, go to admin page instead of dashboard
      if (auth.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const handleExploreClick = () => {
    navigate('/marketplace');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  // Sort products based on filter option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filterOption) {
      case 'latest':
        // For demo purposes, we'll use the ID as a proxy for recency
        return b.id.localeCompare(a.id);
      case 'popular':
        // Sort by pulse count
        return b.pulses - a.pulses;
      case 'trending':
        // For trending, we'll combine pulses with a random "recent growth" factor
        // In a real app, this would be based on recent pulse growth
        const aGrowth = a.pulses * (Math.random() * 0.5 + 0.5); // Random growth factor
        const bGrowth = b.pulses * (Math.random() * 0.5 + 0.5);
        return bGrowth - aGrowth;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        auth={auth}
        onAuthClick={handleProfileClick}
        onUploadClick={handleUploadClick}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onHome={handleHomeClick}
        onSignOut={handleSignOut}
      />

      <Routes>
        <Route path="/" element={
          <>
            <Hero onUploadClick={handleUploadClick} onExploreClick={handleExploreClick} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">
                  {searchQuery ? 'Search Results' : 'Featured Automations'}
                </h2>
                <div className="flex gap-2">
                  <button 
                    className={`px-4 py-2 ${filterOption === 'latest' ? 'bg-purple-600' : 'bg-gray-900 hover:bg-gray-800'} rounded-lg`}
                    onClick={() => setFilterOption('latest')}
                  >
                    Latest
                  </button>
                  <button 
                    className={`px-4 py-2 ${filterOption === 'popular' ? 'bg-purple-600' : 'bg-gray-900 hover:bg-gray-800'} rounded-lg`}
                    onClick={() => setFilterOption('popular')}
                  >
                    Popular
                  </button>
                  <button 
                    className={`px-4 py-2 ${filterOption === 'trending' ? 'bg-purple-600' : 'bg-gray-900 hover:bg-gray-800'} rounded-lg`}
                    onClick={() => setFilterOption('trending')}
                  >
                    Trending
                  </button>
                </div>
              </div>
              
              {sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">
                    No automations found for "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onCardClick={() => navigate(`/product/${product.id}`)}
                    />
                  ))}
                </div>
              )}
            </main>
          </>
        } />
        <Route path="/upload" element={<UploadPage onSubmit={handleProductSubmit} />} />
        <Route path="/dashboard" element={<DashboardPage user={auth.user} products={products} />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/env-check" element={<EnvCheck />} />
        <Route path="/admin" element={<AdminPage auth={auth} />} />
        <Route path="/admin/curation" element={<AdminCurationPage auth={auth} />} />
        <Route path="/admin/stats" element={<AdminStatsPage auth={auth} />} />
        <Route path="/admin/users" element={<AdminUsersPage auth={auth} />} />
        <Route path="/settings" element={<SettingsPage user={auth.user} />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/product/:id" element={<ProductDetailPage products={products} auth={auth} />} />
      </Routes>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </Router>
  );
}