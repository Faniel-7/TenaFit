import { Food } from "./nutritionTypes";

export const foods: Food[] = [
  {
    id: "teff",
    name: "Teff",
    localName: "ጤፍ",
    origin: "ethiopian",
    category: "grain",

    servingSize: 100,
    servingUnit: "g",

    nutrition: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
    },

    tags: [
      "local",
      "grain",
    ],

    source: "EPHI Ethiopian Food Composition Table",
  },

  {
    id: "egg",
    name: "Egg",
    origin: "international",
    category: "protein",

    servingSize: 1,
    servingUnit: "egg",

    nutrition: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
    },

    tags: [
      "protein",
      "breakfast",
    ],

    source: "Nutrition database",
  },

  {
    id: "banana",
    name: "Banana",
    localName: "ሙዝ",
    origin: "international",
    category: "fruit",

    servingSize: 1,
    servingUnit: "medium banana",

    nutrition: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
    },

    tags: [
      "fruit",
      "snack",
      "breakfast",
    ],

    source: "Nutrition database",
  },
];