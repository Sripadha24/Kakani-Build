import { GoogleGenAI } from "@google/genai";

export const refineDescription = async (name: string, currentDesc: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

export const generateHeroImage = async (name: string, description: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `A professional, high-quality, high-resolution hero image for a modern business website. The business name is "${name}" and they specialize in: "${description}". The style should be clean, professional, and visually striking, suitable for a landing page header. Cinematic lighting, professional photography, wide angle. No text in the image.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    if (response.candidates && response.candidates[0] && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini image generation failed:", error);
    return null;
  }
};