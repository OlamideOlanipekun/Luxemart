const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

let aiInstance = null;

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Gemini API Key is missing. Set GEMINI_API_KEY in .env');
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

// POST /api/ai/style-advice
router.post('/style-advice', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'query is required' });

    const ai = getAI();
    if (!ai) return res.json({ response: 'Stylist is currently offline. Please check back later.' });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: query,
      config: {
        systemInstruction: "You are an expert fashion stylist and shopping assistant for LuxeMart, a premium e-commerce store. Your goal is to provide concise, friendly, and helpful advice. Recommend products based on current trends or specific occasions. LuxeMart specializes in Men, Women, Accessories, and Tech.",
        temperature: 0.7,
      },
    });

    res.json({ response: response.text || 'No response generated.' });
  } catch (err) {
    console.error('AI style-advice error:', err);
    res.json({ response: "Something went wrong. I might be having trouble connecting to the fashion world!" });
  }
});

// POST /api/ai/product-insight
router.post('/product-insight', async (req, res) => {
  try {
    const { productName, category } = req.body;
    if (!productName) return res.status(400).json({ error: 'productName is required' });

    const ai = getAI();
    if (!ai) return res.json({ response: 'A definitive silhouette designed for the modern rotation.' });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Provide a short 2-sentence "Stylist's Insight" for a product called "${productName}" in the "${category}" category. Focus on its archival value and a quick styling tip. Keep it sophisticated and premium.`,
      config: {
        systemInstruction: "You are a senior fashion editor at a luxury magazine. Your tone is authoritative, minimal, and sophisticated.",
        temperature: 0.8,
      },
    });

    res.json({ response: response.text || 'A definitive silhouette designed for the modern rotation.' });
  } catch (err) {
    console.error('AI product-insight error:', err);
    res.json({ response: 'A definitive silhouette designed for the modern rotation. Versatility meets uncompromising craftsmanship.' });
  }
});

// POST /api/ai/review-summary
router.post('/review-summary', async (req, res) => {
  try {
    const { productName, reviews } = req.body;
    if (!productName) return res.status(400).json({ error: 'productName is required' });

    const ai = getAI();
    if (!ai) return res.json({ response: '• High consumer satisfaction\n• Premium build quality\n• True to size' });

    const reviewTexts = (reviews || []).map(r => r.comment).filter(Boolean).join(' | ');

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Synthesize these member reviews for "${productName}": ${reviewTexts || 'No reviews yet.'}. Provide 3 very short bullet points summarizing the consensus on quality, fit, and style.`,
      config: {
        systemInstruction: "You are an AI data analyst for a luxury brand. Summarize customer feedback into high-level, elegant bullet points.",
        temperature: 0.3,
      },
    });

    res.json({ response: response.text || '• Unmatched material depth\n• Consistent tailored fit\n• Exceptional archival potential' });
  } catch (err) {
    console.error('AI review-summary error:', err);
    res.json({ response: '• Unmatched material depth\n• Consistent tailored fit\n• Exceptional archival potential' });
  }
});

module.exports = router;
