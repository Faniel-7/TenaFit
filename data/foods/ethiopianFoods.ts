import { Food } from "../../types/nutrition";

export const ethiopianFoods: Food[] = [
  {
    id: "eth_001",
    name: "Example Ethiopian Food",
    nameEnglish: "Example Ethiopian Food",
    nameAmharic: "",

    cuisine: "local",

    category: "legume",

    servingSize: 100,
    servingUnit: "g",

    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,

    suitableFor: {
      weightLoss: true,
      maintenance: true,
      weightGain: true,
    },

    tags: ["local", "ethiopian"],

    preparation: "cooked",

    source: "EFCT 2025",
  },
];