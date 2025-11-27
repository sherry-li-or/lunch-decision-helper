import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem } from "../types";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getSmartRecommendation = async (
  availableFoods: FoodItem[],
  userPreference?: string
): Promise<{ foodName: string; reason: string; foodEmoji: string }> => {
  const ai = getAiClient();
  
  const foodNames = availableFoods.map(f => f.name).join(", ");
  
  const prompt = `
    You are a helpful Taiwanese food expert assisting a user to decide what to eat for lunch.
    
    The available options are: ${foodNames}.
    
    The user's current mood/preference is: "${userPreference || 'Anything good'}".
    
    Please select ONE best option from the list (or a generic type closely related if the exact match isn't perfect but fits the list) and explain why in a fun, appetizing way.
    
    Respond in Traditional Chinese (zh-TW).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "The name of the selected food" },
            reason: { type: Type.STRING, description: "A fun, short reason (max 2 sentences) why this is a great choice right now" },
            foodEmoji: { type: Type.STRING, description: "A single emoji representing the food" }
          },
          required: ["foodName", "reason", "foodEmoji"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Recommendation failed:", error);
    // Fallback
    const randomFood = availableFoods[Math.floor(Math.random() * availableFoods.length)];
    return {
      foodName: randomFood.name,
      reason: "AI 休息中，這是命運的安排！",
      foodEmoji: randomFood.emoji
    };
  }
};

export const getFunnyFoodQuote = async (): Promise<string> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Give me a very short, funny, one-sentence quote about lunch or being hungry in Traditional Chinese.",
        });
        return response.text || "吃飯皇帝大！";
    } catch (e) {
        return "吃飯皇帝大！";
    }
}
