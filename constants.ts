import { CategoryType, FoodItem, Scenario } from './types';
import { SunIcon, ClockIcon, DollarIcon, LeafIcon } from './components/Icons';

export const INITIAL_FOODS: FoodItem[] = [
  // Bento
  { id: '1', name: '雞腿便當', category: CategoryType.BENTO, emoji: '🍗', tags: ['經典', '飽足', '快速', '平價'] },
  { id: '2', name: '排骨飯', category: CategoryType.BENTO, emoji: '🍱', tags: ['經典', '炸物', '快速', '平價'] },
  { id: '3', name: '燒臘三寶飯', category: CategoryType.BENTO, emoji: '🦆', tags: ['港式', '肉多', '快速'] },
  { id: '4', name: '控肉飯', category: CategoryType.BENTO, emoji: '🥓', tags: ['傳統', '肥美', '平價'] },
  
  // Noodles
  { id: '5', name: '牛肉麵', category: CategoryType.NOODLES, emoji: '🍜', tags: ['湯頭', '經典', '熱湯'] },
  { id: '6', name: '水餃', category: CategoryType.NOODLES, emoji: '🥟', tags: ['方便', '麵食', '平價', '快速'] },
  { id: '7', name: '麻醬麵', category: CategoryType.NOODLES, emoji: '🥢', tags: ['乾麵', '傳統', '平價', '快速'] },
  { id: '8', name: '鍋燒意麵', category: CategoryType.NOODLES, emoji: '🍲', tags: ['熱湯', '豐富', '平價'] },

  // Western
  { id: '9', name: '麥當勞', category: CategoryType.WESTERN, emoji: '🍔', tags: ['速食', '快樂', '快速', '野餐'] },
  { id: '10', name: '義大利麵', category: CategoryType.WESTERN, emoji: '🍝', tags: ['洋食', '約會'] },
  { id: '11', name: 'Subway', category: CategoryType.WESTERN, emoji: '🥪', tags: ['輕食', '蔬菜', '健康', '快速', '野餐'] },
  
  // Japanese
  { id: '12', name: '壽司', category: CategoryType.JAPANESE, emoji: '🍣', tags: ['冷食', '精緻', '野餐', '快速'] },
  { id: '13', name: '丼飯 (牛/豬)', category: CategoryType.JAPANESE, emoji: '🍚', tags: ['飽足', '快速'] },
  { id: '14', name: '拉麵', category: CategoryType.JAPANESE, emoji: '🍜', tags: ['熱湯', '日式'] },
  
  // Thai
  { id: '15', name: '打拋豬肉飯', category: CategoryType.THAI, emoji: '🌶️', tags: ['下飯', '微辣'] },
  { id: '16', name: '椒麻雞', category: CategoryType.THAI, emoji: '🍗', tags: ['炸物', '酸辣'] },
  
  // Healthy
  { id: '17', name: '健康餐盒', category: CategoryType.HEALTHY, emoji: '🥗', tags: ['低卡', '增肌', '健康'] },
  { id: '18', name: '沙拉', category: CategoryType.HEALTHY, emoji: '🥬', tags: ['清爽', '減脂', '健康', '野餐'] },
];

export const CATEGORY_COLORS: Record<CategoryType, string> = {
  [CategoryType.BENTO]: 'bg-orange-100 text-orange-800 border-orange-200',
  [CategoryType.NOODLES]: 'bg-blue-100 text-blue-800 border-blue-200',
  [CategoryType.WESTERN]: 'bg-red-100 text-red-800 border-red-200',
  [CategoryType.JAPANESE]: 'bg-rose-100 text-rose-800 border-rose-200',
  [CategoryType.THAI]: 'bg-amber-100 text-amber-800 border-amber-200',
  [CategoryType.HEALTHY]: 'bg-green-100 text-green-800 border-green-200',
  [CategoryType.DESSERT]: 'bg-pink-100 text-pink-800 border-pink-200',
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'cheap',
    name: '省荷包',
    description: '月底救星，便宜好吃',
    filterTag: '平價',
    icon: DollarIcon,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    id: 'rush',
    name: '趕時間',
    description: '快速解決，馬上能吃',
    filterTag: '快速',
    icon: ClockIcon,
    color: 'bg-slate-100 text-slate-800 border-slate-200'
  },
  {
    id: 'weather',
    name: '天氣好',
    description: '適合外帶，享受陽光',
    filterTag: '野餐',
    icon: SunIcon,
    color: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  {
    id: 'healthy',
    name: '顧健康',
    description: '清爽無負擔',
    filterTag: '健康',
    icon: LeafIcon,
    color: 'bg-green-100 text-green-800 border-green-200'
  }
];