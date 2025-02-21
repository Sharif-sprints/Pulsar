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
            { icon: Sparkles, title: 'Global Selection', desc: 'A global selection of AI tools from top creators' },
            { icon: Zap, title: 'No-Code Required', desc: 'Plug-and-play automation—no coding required' },
            { icon: Shield, title: 'Seamless Integration', desc: 'Integrate seamlessly with your existing marketing activities' },
          ].map((feature, i) => (
            <div key={i} className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <feature.icon className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}