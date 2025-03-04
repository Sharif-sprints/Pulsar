import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Share2, Zap, ArrowLeft, Tag, User, Calendar, Download, Shield, Loader2, 
  Code, Database, Server, Globe, Clock, Video, MessageSquare, ChevronDown, ChevronUp,
  CheckCircle, AlertTriangle, Cpu, Star, MessageCircle
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { ChatModal } from '../components/ChatModal';
import type { Product, AuthState, ConsultationOption } from '../types';

interface ProductDetailPageProps {
  products: Product[];
  auth?: AuthState;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export function ProductDetailPage({ products, auth }: ProductDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'howto' | 'faq'>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [hasPulsed, setHasPulsed] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Find related products (same category or shared tags)
      const related = products
        .filter(p => 
          p.id !== id && 
          (p.category === foundProduct.category || 
           p.tags.some(tag => foundProduct.tags.includes(tag)))
        )
        .slice(0, 3);
      
      setRelatedProducts(related);
    } else {
      navigate('/marketplace');
    }
  }, [id, products, navigate]);

  const handlePurchase = async () => {
    if (!product) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Could not initialize Stripe. Please check your API key.');
      }

      const response = await fetch('/.netlify/functions/create-checkout', {
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

  const handlePulse = () => {
    if (!auth?.isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    if (product && !hasPulsed) {
      // In a real app, this would call an API to update the pulse count
      setProduct({
        ...product,
        pulses: product.pulses + 1
      });
      setHasPulsed(true);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleBookConsultation = () => {
    if (!auth?.isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    setShowChatModal(true);
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Sample FAQ items
  const faqItems = [
    {
      question: "What are the system requirements?",
      answer: "This tool runs in any modern web browser. For optimal performance, we recommend Chrome, Firefox, or Edge with at least 8GB of RAM."
    },
    {
      question: "How do I install and set up the tool?",
      answer: "After purchase, you'll receive access to our installation guide. The setup process is straightforward and typically takes less than 5 minutes."
    },
    {
      question: "Is there a free trial available?",
      answer: "We don't offer a free trial for this specific product, but we do have a money-back guarantee if you're not satisfied with your purchase."
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes, all purchases include 6 months of technical support via email and our support portal. Extended support plans are available for purchase."
    },
    {
      question: "Can I use this tool for commercial projects?",
      answer: "Yes, your purchase includes a commercial license. You can use this tool for both personal and commercial projects without additional fees."
    }
  ];

  // Prerequisites for the tool
  const prerequisites = [
    { 
      type: "Tools", 
      items: ["Modern web browser", "Command line interface", "Node.js v14+"],
      icon: Tool
    },
    { 
      type: "Subscriptions", 
      items: ["OpenAI API key ($0.002 per 1K tokens)", "Optional: Cloud hosting provider"],
      icon: CreditCard
    },
    { 
      type: "Skills", 
      items: ["Basic understanding of JavaScript", "Familiarity with API concepts"],
      icon: Brain
    }
  ];

  // Consultation options
  const consultationOptions: ConsultationOption[] = [
    {
      id: "setup",
      title: "I need help setting this up",
      description: "Get assistance with installation and configuration"
    },
    {
      id: "troubleshoot",
      title: "I need help troubleshooting",
      description: "Resolve issues with your existing implementation"
    },
    {
      id: "customize",
      title: "I want your help customizing this flow",
      description: "Adapt the workflow to your specific needs"
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Marketplace
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-cover w-full h-full"
                />
                {/* Video overlay button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="p-4 bg-black/50 hover:bg-black/70 rounded-full transition-colors">
                    <Video className="h-8 w-8 text-white" />
                  </button>
                </div>
              </div>
              
              <div className="border-b border-gray-800">
                <div className="flex overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-4 font-medium whitespace-nowrap ${
                      activeTab === 'overview' 
                        ? 'border-b-2 border-purple-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('howto')}
                    className={`px-6 py-4 font-medium whitespace-nowrap ${
                      activeTab === 'howto' 
                        ? 'border-b-2 border-purple-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    How to Make it Work
                  </button>
                  <button
                    onClick={() => setActiveTab('faq')}
                    className={`px-6 py-4 font-medium whitespace-nowrap ${
                      activeTab === 'faq' 
                        ? 'border-b-2 border-purple-500 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    FAQ
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <h1 className="text-3xl font-bold">{product.title}</h1>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handlePulse}
                      disabled={!auth?.isAuthenticated || hasPulsed}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        hasPulsed 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' 
                          : auth?.isAuthenticated 
                            ? 'bg-gray-800 hover:bg-gray-700 text-white border border-yellow-500/50 hover:border-yellow-400' 
                            : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                      }`}
                      title={!auth?.isAuthenticated ? "Login to give a pulse" : hasPulsed ? "Already pulsed" : "Give a pulse"}
                    >
                      <Zap className={`h-5 w-5 ${hasPulsed ? 'text-yellow-400' : ''}`} />
                      <span>{hasPulsed ? "Pulsed!" : "Pulse"}</span>
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full">
                      <Share2 className="h-5 w-5 text-gray-300" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{product.creator}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{product.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Added June 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-gray-300">{product.pulses} pulses</span>
                  </div>
                </div>
                
                {activeTab === 'overview' && (
                  <>
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-3">Description</h2>
                      <p className="text-gray-300 leading-relaxed">
                        {product.description}
                      </p>
                      <p className="text-gray-300 leading-relaxed mt-4">
                        This powerful AI tool streamlines your workflow and saves you hours of manual work. 
                        Built with the latest machine learning technology, it delivers accurate results with minimal setup.
                      </p>
                    </div>
                    
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-3">Key Features</h2>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-green-400">•</div>
                          <span>Intuitive user interface for easy navigation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-green-400">•</div>
                          <span>Advanced AI processing capabilities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-green-400">•</div>
                          <span>Seamless integration with popular platforms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-green-400">•</div>
                          <span>Regular updates and improvements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 text-green-400">•</div>
                          <span>Comprehensive documentation and support</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-3">Demo Video</h2>
                      <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                        <Video className="h-12 w-12 text-gray-600" />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Watch a quick demo of how this tool works and its main features.
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Tags</h2>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {activeTab === 'howto' && (
                  <>
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">Prerequisites</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Code className="h-5 w-5 text-purple-400" />
                            <h3 className="font-medium">Required Tools</h3>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li>• Modern web browser</li>
                            <li>• Command line interface</li>
                            <li>• Node.js v14+</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <CreditCard className="h-5 w-5 text-purple-400" />
                            <h3 className="font-medium">Subscriptions</h3>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li>• OpenAI API key ($0.002 per 1K tokens)</li>
                            <li>• Optional: Cloud hosting provider</li>
                          </ul>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <User className="h-5 w-5 text-purple-400" />
                            <h3 className="font-medium">Skills Needed</h3>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li>• Basic understanding of JavaScript</li>
                            <li>• Familiarity with API concepts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">Difficulty Level</h2>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500 w-1/2"></div>
                          </div>
                          <span className="font-medium text-yellow-400">Medium</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          This tool requires some technical knowledge to set up and configure, but comes with comprehensive documentation to guide you through the process.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">Setup Process</h2>
                      <div className="space-y-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-sm">1</div>
                            <span>Installation</span>
                          </h3>
                          <p className="text-sm text-gray-300 mb-2">
                            Install the package using npm or yarn:
                          </p>
                          <div className="bg-gray-900 p-2 rounded font-mono text-sm mb-2">
                            npm install ai-document-processor
                          </div>
                          <p className="text-sm text-gray-300">
                            This will install all required dependencies and set up the basic configuration.
                          </p>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-sm">2</div>
                            <span>Configuration</span>
                          </h3>
                          <p className="text-sm text-gray-300 mb-2">
                            Create a configuration file with your API keys and preferences:
                          </p>
                          <div className="bg-gray-900 p-2 rounded font-mono text-sm mb-2">
                            {`// config.js\nmodule.exports = {\n  apiKey: 'your-api-key',\n  modelName: 'gpt-4',\n  maxTokens: 2000\n};`}
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-sm">3</div>
                            <span>Integration</span>
                          </h3>
                          <p className="text-sm text-gray-300">
                            Import the package into your application and start processing documents:
                          </p>
                          <div className="bg-gray-900 p-2 rounded font-mono text-sm mt-2">
                            {`const processor = require('ai-document-processor');\n\nprocessor.analyze('path/to/document.pdf')\n  .then(results => console.log(results))\n  .catch(err => console.error(err));`}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Common Issues & Solutions</h2>
                      <div className="space-y-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <h3 className="font-medium">API Rate Limiting</h3>
                          </div>
                          <p className="text-sm text-gray-300">
                            If you encounter rate limiting issues, implement a retry mechanism with exponential backoff or upgrade to a higher tier API plan.
                          </p>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <h3 className="font-medium">Memory Usage</h3>
                          </div>
                          <p className="text-sm text-gray-300">
                            For large documents, you may need to increase the available memory. Use the --max-old-space-size flag when running Node.js.
                          </p>
                        </div>
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <h3 className="font-medium">Performance Optimization</h3>
                          </div>
                          <p className="text-sm text-gray-300">
                            For better performance, process documents in batches and implement caching for frequently accessed results.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {activeTab === 'faq' && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                      {faqItems.map((faq, index) => (
                        <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleFaq(index)}
                            className="w-full flex items-center justify-between p-4 text-left bg-gray-800 hover:bg-gray-700 transition-colors"
                          >
                            <span className="font-medium">{faq.question}</span>
                            {expandedFaq === index ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          {expandedFaq === index && (
                            <div className="p-4 bg-gray-900">
                              <p className="text-gray-300">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {/* Purchase Box */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">${product.price}</h2>
                  <div className="flex items-center gap-1">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium">{product.pulses} pulses</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">One-time purchase, lifetime access</p>
              </div>
              
              <button
                onClick={handlePurchase}
                disabled={isLoading}
                className={`w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 px-4 transition-colors flex items-center justify-center gap-2 mb-4 ${
                  isLoading ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Purchase Now</span>
                  </>
                )}
              </button>
              
              {error && (
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-full">
                    <Download className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">Instant Download</p>
                    <p className="text-sm text-gray-400">Access blueprint immediately after purchase</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-full">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">Secure Transaction</p>
                    <p className="text-sm text-gray-400">SSL encrypted payment</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">What's Included</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 text-green-400">✓</div>
                    <span className="text-gray-300">Expert help</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 text-green-400">✓</div>
                    <span className="text-gray-300">Verified platform creator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 text-green-400">✓</div>
                    <span className="text-gray-300">Tailored to your needs</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Creator Box */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h3 className="font-semibold mb-3">About the Creator</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {product.creator.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{product.creator}</p>
                  <p className="text-sm text-gray-400">AI Developer & Consultant</p>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-600'}`}
                      fill={star <= 4 ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-400">4.0 (24 reviews)</span>
              </div>
              
              <p className="text-sm text-gray-300 mb-3">
                Expert in AI and machine learning with over 10 years of experience building innovative solutions for businesses.
              </p>
              
              <button 
                onClick={handleBookConsultation}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 px-4 transition-colors flex items-center justify-center gap-2 border border-purple-500"
              >
                <MessageSquare className="h-4 w-4 text-purple-400" />
                <span>Book Consultation</span>
              </button>
            </div>
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div 
                  key={relatedProduct.id}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{relatedProduct.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">${relatedProduct.price}</span>
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm">{relatedProduct.pulses} pulses</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChatModal && (
        <ChatModal 
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          product={product}
          user={auth?.user}
          consultationOptions={consultationOptions}
        />
      )}
    </div>
  );
}

// Additional icons
function Tool(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function CreditCard(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function Brain(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}