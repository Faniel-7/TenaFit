import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({
  apiKey,
});

export interface AIRequest {
  prompt: string;
}

export async function generateAIRecommendation({
  prompt,
}: AIRequest): Promise<string> {
  const response = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: prompt,
  });

  const text = response.output_text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}