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

    calories: 71,
    protein: 2.5,
    carbohydrates: 12.0,
    fat: 1.5,
    fiber: 1.7,

    suitableFor: {
      weightLoss: true,
      maintenance: true,
      weightGain: true,
    },

    suitableMeals: [
      "breakfast",
      "snack",
    ],

    tags: [
      "oats",
      "whole-grain",
      "fiber",
      "breakfast",
    ],

    source:
      "USDA FoodData Central",
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

    calories: 165,
    protein: 31.0,
    carbohydrates: 0,
    fat: 3.6,
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
      "lean-protein",
    ],

    source:
      "USDA FoodData Central",
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

    calories: 123,
    protein: 2.7,
    carbohydrates: 25.6,
    fat: 1.0,
    fiber: 1.6,

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
      "carbohydrate",
      "fiber",
    ],

    source:
      "USDA FoodData Central",
  },

  {
    id: "INT_004",
    name: "Scrambled eggs",
    nameEnglish: "Scrambled eggs",

    cuisine: "other",

    category: "egg",

    preparation: "cooked",

    servingSize: 100,
    servingUnit: "g",

    calories: 148,
    protein: 9.9,
    carbohydrates: 1.6,
    fat: 10.0,
    fiber: 0,

    suitableFor: {
      weightLoss: true,
      maintenance: true,
      weightGain: true,
    },

    suitableMeals: [
      "breakfast",
      "lunch",
      "dinner",
    ],

    tags: [
      "egg",
      "protein",
      "breakfast",
    ],

    source:
      "USDA FoodData Central",
  },

  {
    id: "INT_005",
    name: "Salmon",
    nameEnglish: "Salmon",

    cuisine: "other",

    category: "fish",

    preparation: "cooked",

    servingSize: 100,
    servingUnit: "g",

    calories: 206,
    protein: 22.1,
    carbohydrates: 0,
    fat: 12.4,
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
      "fish",
      "high-protein",
      "healthy-fat",
    ],

    source:
      "USDA FoodData Central",
  },

  {
    id: "INT_006",
    name: "Boiled potato",
    nameEnglish: "Boiled potato",

    cuisine: "other",

    category: "root",

    preparation: "cooked",

    servingSize: 100,
    servingUnit: "g",

    calories: 87,
    protein: 1.9,
    carbohydrates: 20.1,
    fat: 0.1,
    fiber: 1.8,

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
      "potato",
      "carbohydrate",
      "fiber",
    ],

    source:
      "USDA FoodData Central",
  },

  {
    id: "INT_007",
    name: "Banana",
    nameEnglish: "Banana",

    cuisine: "other",

    category: "fruit",

    preparation: "raw",

    servingSize: 100,
    servingUnit: "g",

    calories: 89,
    protein: 1.1,
    carbohydrates: 22.8,
    fat: 0.3,
    fiber: 2.6,

    suitableFor: {
      weightLoss: true,
      maintenance: true,
      weightGain: true,
    },

    suitableMeals: [
      "breakfast",
      "snack",
    ],
tags: [
      "fruit",
      "banana",
      "carbohydrate",
      "fiber",
    ],

    source:
      "USDA FoodData Central",
  },

  {
    id: "INT_008",
    name: "Avocado",
    nameEnglish: "Avocado",

    cuisine: "other",

    category: "fruit",

    preparation: "raw",

    servingSize: 100,
    servingUnit: "g",

    calories: 160,
    protein: 2.0,
    carbohydrates: 8.5,
    fat: 14.7,
    fiber: 6.7,

    suitableFor: {
      weightLoss: true,
      maintenance: true,
      weightGain: true,
    },

    suitableMeals: [
      "breakfast",
      "lunch",
      "snack",
    ],

    tags: [
      "fruit",
      "healthy-fat",
      "fiber",
    ],

    source:
      "USDA FoodData Central",
  },

  {
    id: "INT_009",
    name: "Greek yogurt",
    nameEnglish: "Plain Greek yogurt",

    cuisine: "other",

    category: "dairy",

    preparation: "cooked",

    servingSize: 100,
    servingUnit: "g",

    calories: 59,
    protein: 10.2,
    carbohydrates: 3.6,
    fat: 0.4,
    fiber: 0,

    suitableFor: {
      weightLoss: true,
      maintenance: true,
      weightGain: true,
    },

    suitableMeals: [
      "breakfast",
      "snack",
    ],

    tags: [
      "yogurt",
      "dairy",
      "protein",
    ],

    source:
      "USDA FoodData Central",
  },

  {
    id: "INT_010",
    name: "Cooked lentils",
    nameEnglish: "Cooked lentils",

    cuisine: "other",

    category: "legume",

    preparation: "cooked",

    servingSize: 100,
    servingUnit: "g",

    calories: 116,
    protein: 9.0,
    carbohydrates: 20.1,
    fat: 0.4,
    fiber: 7.9,

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
      "lentils",
      "legume",
      "plant-protein",
      "fiber",
    ],

    source:
      "USDA FoodData Central",
  },

  {
    id: "INT_011",
    name: "Peanut butter",
    nameEnglish: "Peanut butter",

    cuisine: "other",

    category: "nut",

    preparation: "mixed",

    servingSize: 100,
    servingUnit: "g",

    calories: 588,
    protein: 25.1,
    carbohydrates: 20.0,
    fat: 50.0,
    fiber: 6.0,

    suitableFor: {
      weightLoss: false,
      maintenance: true,
      weightGain: true,
    },

    suitableMeals: [
      "breakfast",
      "snack",
    ],

    tags: [
      "peanut",
      "protein",
      "healthy-fat",
      "energy-dense",
    ],

    source:
      "USDA FoodData Central",
  },

  {
    id: "INT_012",
    name: "Whole wheat bread",
    nameEnglish: "Whole wheat bread",

    cuisine: "other",

    category: "cereal",

    preparation: "cooked",

    servingSize: 100,
    servingUnit: "g",

    calories: 247,
    protein: 13.0,
    carbohydrates: 41.0,
    fat: 4.2,
    fiber: 6.0,

    suitableFor: {
      weightLoss: true,
      maintenance: true,
      weightGain: true,
    },

    suitableMeals: [
      "breakfast",
      "lunch",
      "snack",
    ],

    tags: [
      "bread",
      "whole-grain",
      "fiber",
      "carbohydrate",
    ],

    source:
      "USDA FoodData Central",
  },
];