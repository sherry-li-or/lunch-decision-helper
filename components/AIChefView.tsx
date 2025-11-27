import React, { useState } from 'react';
import { FoodItem } from '../types';
import { getSmartRecommendation } from '../services/geminiService';
import { SparklesIcon } from './Icons';

interface AIChefViewProps {
  foods: FoodItem[];
  onAddToFavorites: (id: string) => void;
  favorites: string[];
}

export const AIChefView: React.FC<AIChefViewProps> = ({ foods, onAddToFavorites, favorites }) => {
  const [preference, setPreference] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ foodName: string; reason: string; foodEmoji: string } | null>(null);

  const handleAskAI = async () => {
    setLoading(true);
    setResult(null);
    try {
      const suggestion = await getSmartRecommendation(foods, preference);
      setResult(suggestion);
    } catch (e) {
      // Error handled in service
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full text-white shadow-lg mb-2">
          <SparklesIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">AI 午餐顧問</h2>
        <p className="text-gray-500 text-sm">不知道吃什麼？告訴我你想吃什麼口味，或直接讓 AI 幫你決定！</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-purple-100">
        <textarea
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-gray-700 placeholder-gray-400 bg-gray-50"
          rows={3}
          placeholder="例如：想吃辣的、不想吃太油、想喝熱湯..."
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
        />
        <button
          onClick={handleAskAI}
          disabled={loading}
          className={`mt-4 w-full py-3 rounded-xl font-bold text-white transition-all shadow-md
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95'
            }`}
        >
          {loading ? 'AI 思考中...' : '請推薦！'}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-[fadeIn_0.5s_ease-out]">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-50 p-6 text-center border-b border-purple-100">
             <div className="text-6xl mb-4 animate-[bounce_1s_infinite]">{result.foodEmoji}</div>
             <h3 className="text-2xl font-bold text-gray-800">{result.foodName}</h3>
          </div>
          <div className="p-6">
            <h4 className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">AI 推薦理由</h4>
            <p className="text-gray-700 leading-relaxed text-lg">{result.reason}</p>
            
            <button 
                onClick={() => {
                   // Find food item ID to favorite
                   const found = foods.find(f => f.name === result.foodName);
                   if (found && !favorites.includes(found.id)) {
                       onAddToFavorites(found.id);
                   }
                }}
                disabled={foods.find(f => f.name === result.foodName) && favorites.includes(foods.find(f => f.name === result.foodName)!.id)}
                className="mt-6 w-full py-2 bg-purple-50 text-purple-700 font-semibold rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
                {foods.find(f => f.name === result.foodName) && favorites.includes(foods.find(f => f.name === result.foodName)!.id) 
                  ? '已收藏' 
                  : '加入收藏'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};