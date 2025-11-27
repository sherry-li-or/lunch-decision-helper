import React, { useState, useEffect, useCallback } from 'react';
import { CATEGORY_COLORS, INITIAL_FOODS, SCENARIOS } from './constants';
import { CategoryType, FoodItem, ViewState, Scenario } from './types';
import { HeartIcon, HomeIcon, GridIcon, SparklesIcon, ChevronLeftIcon, TrashIcon, MapPinIcon } from './components/Icons';
import { AIChefView } from './components/AIChefView';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  
  // Generalized list state for both Categories and Scenarios
  const [activeList, setActiveList] = useState<{
    title: string;
    items: FoodItem[];
    colorTheme?: string;
  } | null>(null);

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

  // --- Actions ---

  const handleOpenCategory = (cat: CategoryType) => {
    setActiveList({
        title: cat,
        items: foods.filter(f => f.category === cat),
    });
    setView('LIST');
  };

  const handleOpenScenario = (scenario: Scenario) => {
    setActiveList({
        title: scenario.name,
        items: foods.filter(f => f.tags.includes(scenario.filterTag)),
        colorTheme: scenario.color
    });
    setView('LIST');
  };

  // --- Views ---

  const renderHome = () => (
    <div className="p-4 pb-24 space-y-8">
      <header className="flex justify-between items-center py-4">
        <div>
           <h1 className="text-2xl font-black text-gray-800">今天午餐吃什麼？</h1>
           <p className="text-gray-500 text-sm">不用煩惱，選一類或問 AI</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-inner">
          😋
        </div>
      </header>

      {/* Quick Access to AI */}
      <div 
        onClick={() => setView('AI_CHEF')}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer transform transition-transform active:scale-95 flex items-center justify-between relative overflow-hidden"
      >
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-1">AI 隨機推薦</h2>
          <p className="text-orange-100 text-sm">選擇困難症救星</p>
        </div>
        <SparklesIcon className="w-10 h-10 text-white/80 relative z-10" />
        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mb-6 blur-xl"></div>
      </div>

      {/* Scenarios (New Feature) */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-400 rounded-full"></span>
            情境選食
        </h3>
        <div className="grid grid-cols-2 gap-3">
            {SCENARIOS.map((scenario) => {
                const Icon = scenario.icon;
                return (
                    <button
                        key={scenario.id}
                        onClick={() => handleOpenScenario(scenario)}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all hover:shadow-md active:scale-95 text-left ${scenario.color}`}
                    >
                        <div className="p-2 bg-white/50 rounded-full">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-sm">{scenario.name}</div>
                            <div className="text-[10px] opacity-80">{scenario.description}</div>
                        </div>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Categories Grid */}
      <div>
         <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-400 rounded-full"></span>
            全部分類
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.values(CategoryType).map((cat) => (
            <button
              key={cat}
              onClick={() => handleOpenCategory(cat)}
              className={`p-3 rounded-xl text-center border transition-all hover:shadow-md active:scale-95 flex flex-col items-center gap-2 ${CATEGORY_COLORS[cat]}`}
            >
              <span className="text-2xl">
                 {/* Simple emoji mapping */}
                 {INITIAL_FOODS.find(f => f.category === cat)?.emoji || '🍽️'}
              </span>
              <span className="font-bold text-xs">{cat.split('/')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Generalized List View
  const renderFoodList = () => {
    if (!activeList) return null;

    return (
      <div className="p-4 pb-24">
         <header className="flex items-center py-4 sticky top-0 bg-[#fff7ed] z-10">
          <button 
            onClick={() => setView('HOME')}
            className="p-2 -ml-2 rounded-full hover:bg-orange-100 text-gray-600"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-2">{activeList.title}</h1>
        </header>

        <div className="space-y-4 mt-2">
            {activeList.items.map(food => (
              <div key={food.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="text-3xl">{food.emoji}</div>
                          <div>
                              <h3 className="font-bold text-gray-800">{food.name}</h3>
                              <div className="flex gap-2 mt-1 flex-wrap">
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

                  {/* Direct Maps Link */}
                  <div className="border-t border-gray-50 pt-2">
                       <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.name + ' 餐廳')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                       >
                           <MapPinIcon className="w-4 h-4" />
                           <span>Google Maps 找餐廳</span>
                       </a>
                  </div>
              </div>
            ))}
            {activeList.items.length === 0 && (
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
            <div className="space-y-4">
                {favItems.map(food => (
                    <div key={food.id} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
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
                        
                        {/* Direct Maps Link for Favorites */}
                        <div className="border-t border-gray-50 pt-2">
                             <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.name + ' 餐廳')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2 flex items-center justify-center gap-2 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                                <MapPinIcon className="w-4 h-4" />
                                <span>Google Maps 找餐廳</span>
                            </a>
                        </div>
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
        {view === 'LIST' && renderFoodList()}
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
            onClick={() => { setView('HOME'); setActiveList(null); }}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${view === 'HOME' || view === 'LIST' ? 'text-orange-600' : 'text-gray-400'}`}
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