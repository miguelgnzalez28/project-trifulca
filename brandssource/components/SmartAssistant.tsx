
import React, { useState } from 'react';
import { getSmartAnswer } from '../services/geminiService';

const SmartAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await getSmartAnswer(query);
      setResponse(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#3D7F5D] text-white p-4 rounded-full shadow-lg hover:bg-[#2e6b48] transition-colors duration-300 z-50 animate-pulse"
        aria-label="Open Smart Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-heading text-gray-800">Smart Assistant - Thinking Mode</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-center text-gray-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                <p className="font-semibold">Thinking...</p>
                <p className="text-sm">Please wait while I analyze your complex query.</p>
            </div>
          ) : (
            <>
              {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
              {response && <div className="prose max-w-none whitespace-pre-wrap">{response}</div>}
              {!response && !error && <p className="text-gray-500">Ask me anything complex about football, jerseys, or sports history!</p>}
            </>
          )}
        </div>

        <form onSubmit={handleQuery} className="p-4 border-t flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Explain the evolution of jersey materials since the 1980s..."
            className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-[#3D7F5D] focus:outline-none"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} className="bg-[#3D7F5D] text-white px-6 py-3 rounded-r-md hover:bg-[#2e6b48] disabled:bg-gray-400 transition-colors">
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};

export default SmartAssistant;
