import { Food } from "../../types/nutrition";

export const internationalFoods: Food[] = [
  {
    id: "INT_001",
    name: "Oatmeal",
    nameEnglish: "Oatmeal",

    cuisine: "other",

    category: "cereal",

    preparation: "cooked",

    servingSize: 100,
    servingUnit: "g",

    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,

    suitableFor: {
      weightLoss: true,
      maintenance: true,
      weightGain: true,
    },

    suitableMeals: [
      "breakfast",
    ],

    tags: [
      "oats",
      "breakfast",
    ],

    source: "International food dataset - pending verification",
  },

  {
    id: "INT_002",
    name: "Chicken breast",
    nameEnglish: "Chicken breast",

    cuisine: "other",

    category: "meat",

    preparation: "cooked",

    servingSize: 100,
    servingUnit: "g",

    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,

    suitableFor: {
      weightLoss: true,
      maintenance: true,
      weightGain: true,
    },

    suitableMeals: [
      "lunch",
      "dinner",
    ],

    tags: [
      "chicken",
      "high-protein",
    ],

    source: "International food dataset - pending verification",
  },

  {
    id: "INT_003",
    name: "Brown rice",
    nameEnglish: "Brown rice",

    cuisine: "other",

    category: "cereal",

    preparation: "cooked",

    servingSize: 100,
    servingUnit: "g",

    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,

    suitableFor: {
      weightLoss: true,
      maintenance: true,
      weightGain: true,
    },

    suitableMeals: [
      "lunch",
      "dinner",
    ],

    tags: [
      "rice",
      "whole-grain",
    ],

    source: "International food dataset - pending verification",
  },
];