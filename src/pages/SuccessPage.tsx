import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSessionId(urlParams.get('session_id'));
  }, []);

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-400 mb-8">
            Thank you for your purchase. You will receive an email confirmation shortly.
          </p>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            <ul className="space-y-4 text-left">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                <span>Check your email for access instructions</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                <span>Visit your dashboard to access your purchased tools</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                <span>Contact support if you need any assistance</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}