import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { AuthModal } from './components/AuthModal';
import { UploadPage } from './pages/UploadPage';
import { DashboardPage } from './pages/DashboardPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { SuccessPage } from './pages/Success';
import { EnvCheck } from './pages/EnvCheck';
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
    priceId: 'price_1P3GVJGk9bLuwZYPeXAtXyoEgX4zJqD8MA1jU04CGJ5DTGyLU9QVOp7zt0SLqreCTJ8PRGP194TxehsLagPYKVwf00wRA7hvqq'
  }
];

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });
  const navigate = useNavigate();

  const handleAuth = (email: string, password: string, isSignUp: boolean) => {
    setAuth({
      isAuthenticated: true,
      user: {
        id: '1',
        name: email.split('@')[0],
        email,
        products: []
      }
    });
    setShowAuthModal(false);
    navigate('/dashboard');
  };

  const handleUploadClick = () => {
    if (!auth.isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate('/upload');
    }
  };

  const handleProductSubmit = (newProduct: Omit<Product, 'id' | 'creator'>) => {
    const productWithId: Product = {
      ...newProduct,
      id: Date.now().toString(),
      creator: auth.user?.name || 'Anonymous'
    };
    setProducts(prev => [productWithId, ...prev]);
    navigate('/marketplace');
  };

  const handleProfileClick = () => {
    if (auth.isAuthenticated) {
      navigate('/dashboard');
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

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        auth={auth}
        onAuthClick={handleProfileClick}
        onUploadClick={handleUploadClick}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onHome={handleHomeClick}
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
                  <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg">
                    Latest
                  </button>
                  <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg">
                    Popular
                  </button>
                  <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg">
                    Trending
                  </button>
                </div>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">
                    No automations found for "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </main>
          </>
        } />
        <Route path="/dashboard" element={
          auth.user ? <DashboardPage user={auth.user} products={products} /> : null
        } />
        <Route path="/upload" element={
          <UploadPage onSubmit={handleProductSubmit} />
        } />
        <Route path="/marketplace" element={
          <MarketplacePage />
        } />
        <Route path="/success" element={
          <SuccessPage />
        } />
        <Route path="/cancel" element={
          <Cancel />
        } />
        <Route path="/env-check" element={<EnvCheck />} />
      </Routes>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;