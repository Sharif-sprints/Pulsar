import React, { useState } from 'react';
import { Star, Share2, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Could not initialize Stripe');
      }

      const response = await fetch('https://pulsar-two.vercel.app/api/create-checkout-session', {
      // const response = await fetch('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: product.price,
          title: product.title,
          description: product.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🚀 ~ handlePurchase ~ data:", data)
      
      if (!data.url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
            {product.category}
          </span>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-800 rounded-full">
              <Share2 className="h-4 w-4 text-gray-400" />
            </button>
            <button className="p-1 hover:bg-gray-800 rounded-full">
              <Star className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-1">{product.title}</h3>
        <p className="text-sm text-gray-400 mb-3">{product.description}</p>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-white">${product.price}</span>
            <button 
              onClick={handlePurchase}
              disabled={isLoading}
              className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? 'cursor-wait' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                'Purchase Now'
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded-lg">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}