import React from 'react';
import { Sparkles, Zap, Shield } from 'lucide-react';

interface HeroProps {
  onUploadClick: () => void;
  onExploreClick: () => void;
}

export function Hero({ onUploadClick, onExploreClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-black">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30" />
        <img
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80"
          alt="AI Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            The Premier Marketplace for
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {" "}AI Tools
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover and integrate powerful AI solutions from verified creators. Transform your workflow with enterprise-grade automation tools.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onExploreClick}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg"
            >
              Explore Marketplace
            </button>
            <button
              onClick={onUploadClick}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              List Your Tool
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            { icon: Sparkles, title: 'Verified Specialists', desc: 'Curated AI tools from verified specialists in automation and AI technology' },
            { icon: Zap, title: 'Expert Curation', desc: 'Every tool is carefully reviewed and curated by our team of AI experts' },
            { icon: Shield, title: 'Complete Control', desc: 'Get the blueprint and customize it for your business needs without subscriptions' },
          ].map((feature, i) => (
            <div key={i} className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <feature.icon className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
        
        {/* How It Works Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xl">1</div>
              <h3 className="text-xl font-semibold text-white mb-3 mt-2">Creators Upload</h3>
              <p className="text-gray-400">AI specialists upload their automation tools and workflows to the platform, sharing their expertise with the community.</p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xl">2</div>
              <h3 className="text-xl font-semibold text-white mb-3 mt-2">Platform Curates</h3>
              <p className="text-gray-400">Our expert team reviews and curates each submission, ensuring quality, security, and usability for all users.</p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xl">3</div>
              <h3 className="text-xl font-semibold text-white mb-3 mt-2">You Take Control</h3>
              <p className="text-gray-400">Purchase and instantly access the blueprint, customize it for your specific needs, and get expert support when needed.</p>
            </div>
          </div>
        </div>
        
        {/* Why Choose Us Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Pulsar</h2>
          <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Our Mission</h3>
                <p className="text-gray-300 mb-4">
                  We're on a mission to make the newest AI technology accessible and understandable for everyone. By connecting creators with users, we're democratizing access to powerful automation tools.
                </p>
                <p className="text-gray-300">
                  Our platform bridges the gap between cutting-edge AI development and practical business applications, empowering organizations of all sizes to leverage the power of artificial intelligence.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Your Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 text-purple-400">•</div>
                    <span className="text-gray-300">Full control over your purchased tools with no recurring subscriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 text-purple-400">•</div>
                    <span className="text-gray-300">Direct support from the creators who built the tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 text-purple-400">•</div>
                    <span className="text-gray-300">Support innovation by directly funding creators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 text-purple-400">•</div>
                    <span className="text-gray-300">Transparent pricing with no hidden fees</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}