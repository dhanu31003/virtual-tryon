'use client';

import { useEffect, useState } from 'react';
import { Wand2 } from 'lucide-react';

interface HistoryItem {
  userImage: string;
  clothingImage: string;
  description: string;
  result: string;
  timestamp: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('tryon-history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed.reverse()); // Show latest first
        }
      } catch (err) {
        console.error('Failed to parse try-on history from localStorage');
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('tryon-history');
    setHistory([]);
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#1d1d1f]">Try-On History</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={clearHistory}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-5 py-2 rounded-full shadow-md transition hover:opacity-90"
        >
          <Wand2 size={18} /> Clear History
        </button>
      </div>

      {history.length === 0 ? (
        <p className="text-center text-gray-600">No history found. Try something on first!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-4 rounded-2xl shadow-md transition hover:shadow-lg"
            >
              <div className="flex gap-3 justify-between mb-4">
                <div className="flex-1">
                  <img
                    src={item.userImage}
                    alt="Person"
                    className="w-full h-28 object-cover rounded-xl border"
                  />
                  <p className="text-center text-xs text-gray-500 mt-1">Person</p>
                </div>
                <div className="flex-1">
                  <img
                    src={item.clothingImage}
                    alt="Garment"
                    className="w-full h-28 object-cover rounded-xl border"
                  />
                  <p className="text-center text-xs text-gray-500 mt-1">Garment</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">Description: {item.description}</p>
              <img
                src={item.result}
                alt="Try-on result"
                className="rounded-xl w-full aspect-video object-cover border"
              />
              <p className="text-xs mt-2 text-gray-400 text-right">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
