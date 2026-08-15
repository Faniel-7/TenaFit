import { Food } from "../../types/nutrition";

export const internationalFoods: Food[] = [
  {
    id: "int_001",

    name: "Example International Food",

    nameEnglish: "Example International Food",

    cuisine: "other",

    category: "protein",

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

    tags: ["international"],

    preparation: "cooked",

    source: "To be added",
  },
];