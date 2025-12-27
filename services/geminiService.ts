
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const refineDescription = async (name: string, currentDesc: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional marketing copywriter. Rewrite the following business description for a small business named "${name}" to make it more professional, catchy, and SEO-friendly. Keep it under 250 characters. 
      Original: "${currentDesc}"`,
    });
    return response.text || currentDesc;
  } catch (error) {
    console.error("Gemini refinement failed:", error);
    return currentDesc;
  }
};
