import { GoogleGenAI, Type } from "@google/genai";
import { NutritionInfo, NUTRITION_SCHEMA } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getNutritionInfo(foodName: string): Promise<NutritionInfo> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide detailed nutritional information for: ${foodName}. Focus on a standard serving size.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
          fiber: { type: Type.NUMBER },
          sugar: { type: Type.NUMBER },
          servingSize: { type: Type.STRING },
          healthScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["foodName", "calories", "protein", "carbs", "fat", "servingSize", "healthScore", "summary"]
      },
    },
  });

  return JSON.parse(response.text || "{}") as NutritionInfo;
}
