import React, { useState, useEffect, useCallback } from 'react';
import { CATEGORY_COLORS, INITIAL_FOODS } from './constants';
import { CategoryType, FoodItem, ViewState } from './types';
import { HeartIcon, HomeIcon, GridIcon, SparklesIcon, ChevronLeftIcon, TrashIcon } from './components/Icons';
import { AIChefView } from './components/AIChefView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>(INITIAL_FOODS);

  // Load favorites from local storage on mount
  useEffect(() => {
    const storedFavs = localStorage.getItem('lunchMateFavorites');
    if (storedFavs) {
      setFavorites(JSON.parse(storedFavs));
    }
  }, []);

  // Save favorites when changed
  useEffect(() => {
    localStorage.setItem('lunchMateFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  }, []);

  const getFavoriteFoods = () => foods.filter(f => favorites.includes(f.id));
  const getCategoryFoods = (cat: CategoryType) => foods.filter(f => f.category === cat);

  // --- Views ---

  const renderHome = () => (
    <div className="p-4 pb-24 space-y-6">
      <header className="flex justify-between items-center py-4">
        <div>
           <h1 className="text-2xl font-black text-gray-800">今天午餐吃什麼？</h1>
           <p className="text-gray-500 text-sm">不用煩惱，選一類或問 AI</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
          😋
        </div>
      </header>

      {/* Quick Access to AI */}
      <div 
        onClick={() => setView('AI_CHEF')}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer transform transition-transform active:scale-95 flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-bold mb-1">AI 隨機推薦</h2>
          <p className="text-orange-100 text-sm">選擇困難症救星</p>
        </div>
        <SparklesIcon className="w-10 h-10 text-white/80" />
      </div>

      {/* Categories Grid */}
      <div>
        <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-gray-800">分類瀏覽</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.values(CategoryType).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setView('CATEGORIES');
              }}
              className={`p-4 rounded-xl text-left border transition-all hover:shadow-md active:scale-95 flex flex-col justify-between h-24 ${CATEGORY_COLORS[cat]}`}
            >
              <span className="text-2xl mb-2">
                 {/* Simple emoji mapping for category icon if needed, using first item's emoji as fallback or generic */}
                 {INITIAL_FOODS.find(f => f.category === cat)?.emoji || '🍽️'}
              </span>
              <span className="font-bold text-sm">{cat}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCategoryList = () => {
    if (!selectedCategory) return null;
    const items = getCategoryFoods(selectedCategory);

    return (
      <div className="p-4 pb-24">
         <header className="flex items-center py-4 sticky top-0 bg-[#fff7ed] z-10">
          <button 
            onClick={() => setView('HOME')}
            className="p-2 -ml-2 rounded-full hover:bg-orange-100 text-gray-600"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-2">{selectedCategory}</h1>
        </header>

        <div className="space-y-3 mt-2">
            {items.map(food => (
              <div key={food.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="text-3xl">{food.emoji}</div>
                      <div>
                          <h3 className="font-bold text-gray-800">{food.name}</h3>
                          <div className="flex gap-2 mt-1">
                              {food.tags.map(tag => (
                                  <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                              ))}
                          </div>
                      </div>
                  </div>
                  <button 
                    onClick={() => toggleFavorite(food.id)}
                    className={`p-2 rounded-full transition-colors ${favorites.includes(food.id) ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:bg-gray-50'}`}
                  >
                      <HeartIcon className="w-6 h-6" filled={favorites.includes(food.id)} />
                  </button>
              </div>
            ))}
            {items.length === 0 && (
                <div className="text-center text-gray-400 py-10">
                    此分類暫無資料
                </div>
            )}
        </div>
      </div>
    );
  };

  const renderFavorites = () => {
    const favItems = getFavoriteFoods();
    return (
      <div className="p-4 pb-24">
        <header className="py-4">
           <h1 className="text-2xl font-black text-gray-800">我的收藏</h1>
           <p className="text-gray-500 text-sm">常吃的都在這</p>
        </header>

        {favItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <HeartIcon className="w-16 h-16 mb-4 text-gray-200" />
                <p>還沒有收藏任何午餐喔</p>
                <button 
                    onClick={() => setView('HOME')}
                    className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full font-bold shadow-md hover:bg-orange-600"
                >
                    去逛逛
                </button>
            </div>
        ) : (
            <div className="space-y-3">
                {favItems.map(food => (
                    <div key={food.id} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">{food.emoji}</div>
                            <div>
                                <h3 className="font-bold text-gray-800">{food.name}</h3>
                                <p className="text-xs text-gray-500">{food.category}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggleFavorite(food.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    );
  };

  // --- Main Layout ---

  return (
    <div className="min-h-screen bg-[#fff7ed] font-sans text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* View Content */}
      <main className="h-full min-h-screen overflow-y-auto custom-scrollbar">
        {view === 'HOME' && renderHome()}
        {view === 'CATEGORIES' && renderCategoryList()}
        {view === 'FAVORITES' && renderFavorites()}
        {view === 'AI_CHEF' && (
            <div className="pb-24">
                 <header className="flex items-center p-4 sticky top-0 bg-[#fff7ed] z-10">
                    <button 
                        onClick={() => setView('HOME')}
                        className="p-2 -ml-2 rounded-full hover:bg-orange-100 text-gray-600"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 ml-2">返回</h1>
                </header>
                <AIChefView foods={foods} onAddToFavorites={toggleFavorite} favorites={favorites} />
            </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-around items-center py-3 px-2 z-50">
        <button 
            onClick={() => { setView('HOME'); setSelectedCategory(null); }}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${view === 'HOME' || view === 'CATEGORIES' ? 'text-orange-600' : 'text-gray-400'}`}
        >
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold">首頁</span>
        </button>

        <button 
            onClick={() => setView('AI_CHEF')}
            className={`flex flex-col items-center justify-center -mt-8`}
        >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${view === 'AI_CHEF' ? 'bg-purple-600 scale-110' : 'bg-gray-800'}`}>
                <SparklesIcon className="w-7 h-7 text-white" />
            </div>
            <span className={`text-[10px] font-bold mt-1 ${view === 'AI_CHEF' ? 'text-purple-600' : 'text-gray-400'}`}>AI 推薦</span>
        </button>

        <button 
            onClick={() => setView('FAVORITES')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${view === 'FAVORITES' ? 'text-red-500' : 'text-gray-400'}`}
        >
            <HeartIcon className="w-6 h-6" filled={view === 'FAVORITES'} />
            <span className="text-[10px] font-bold">收藏</span>
        </button>
      </nav>
    </div>
  );
};

export default App;