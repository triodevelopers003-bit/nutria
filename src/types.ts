export interface NutritionInfo {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  servingSize: string;
  healthScore: number; // 1-100
  summary: string;
  tips: string[];
}

export const NUTRITION_SCHEMA = {
  type: "OBJECT",
  properties: {
    foodName: { type: "STRING" },
    calories: { type: "NUMBER" },
    protein: { type: "NUMBER" },
    carbs: { type: "NUMBER" },
    fat: { type: "NUMBER" },
    fiber: { type: "NUMBER" },
    sugar: { type: "NUMBER" },
    servingSize: { type: "STRING" },
    healthScore: { type: "NUMBER" },
    summary: { type: "STRING" },
    tips: {
      type: "ARRAY",
      items: { type: "STRING" }
    }
  },
  required: ["foodName", "calories", "protein", "carbs", "fat", "servingSize", "healthScore", "summary"]
};
