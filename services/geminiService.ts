import { GoogleGenAI } from "@google/genai";

// Initialize lazily to prevent crash if API_KEY is not yet available in the environment
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Please set API_KEY in your environment variables.");
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const getStyleAdvice = async (userQuery: string) => {
  const ai = getAI();
  if (!ai) return "Stylist is currently offline. Please check back later.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userQuery,
      config: {
        systemInstruction: "You are an expert fashion stylist and shopping assistant for LuxeMart, a premium e-commerce store. Your goal is to provide concise, friendly, and helpful advice. Recommend products based on current trends or specific occasions. LuxeMart specializes in Men, Women, Accessories, and Tech.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong. I might be having trouble connecting to the fashion world!";
  }
};

export const getProductInsight = async (productName: string, category: string) => {
  const ai = getAI();
  if (!ai) return "A definitive silhouette designed for the modern rotation.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short 2-sentence "Stylist's Insight" for a product called "${productName}" in the "${category}" category. Focus on its archival value and a quick styling tip. Keep it sophisticated and premium.`,
      config: {
        systemInstruction: "You are a senior fashion editor at a luxury magazine. Your tone is authoritative, minimal, and sophisticated.",
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    return "A definitive silhouette designed for the modern rotation. Versatility meets uncompromising craftsmanship.";
  }
};

export const getReviewSummary = async (productName: string, reviews: any[]) => {
  const ai = getAI();
  if (!ai) return "• High consumer satisfaction\n• Premium build quality\n• True to size";

  try {
    const reviewTexts = reviews.map(r => r.comment).join(" | ");
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize these member reviews for "${productName}": ${reviewTexts}. Provide 3 very short bullet points summarizing the consensus on quality, fit, and style.`,
      config: {
        systemInstruction: "You are an AI data analyst for a luxury brand. Summarize customer feedback into high-level, elegant bullet points.",
        temperature: 0.3,
      },
    });
    return response.text;
  } catch (error) {
    return "• Unmatched material depth\n• Consistent tailored fit\n• Exceptional archival potential";
  }
};