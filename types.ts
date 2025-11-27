export enum CategoryType {
  BENTO = '便當/自助餐',
  NOODLES = '麵食/水餃',
  WESTERN = '西式/速食',
  JAPANESE = '日式料理',
  THAI = '泰式/東南亞',
  HEALTHY = '健康/輕食',
  DESSERT = '飲料/點心'
}

export interface FoodItem {
  id: string;
  name: string;
  category: CategoryType;
  emoji: string;
  tags: string[];
  description?: string;
}

export type ViewState = 'HOME' | 'LIST' | 'FAVORITES' | 'AI_CHEF';

export interface AISuggestion {
  foodName: string;
  reason: string;
  mood: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  filterTag: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}