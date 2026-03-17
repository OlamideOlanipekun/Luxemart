import { api } from './api';

export const getStyleAdvice = async (userQuery: string): Promise<string> => {
  try {
    const data = await api.ai.styleAdvice(userQuery);
    return data.response;
  } catch {
    return "Something went wrong. I might be having trouble connecting to the fashion world!";
  }
};

export const getProductInsight = async (productName: string, category: string): Promise<string> => {
  try {
    const data = await api.ai.productInsight(productName, category);
    return data.response;
  } catch {
    return "A definitive silhouette designed for the modern rotation. Versatility meets uncompromising craftsmanship.";
  }
};

export const getReviewSummary = async (productName: string, reviews: any[]): Promise<string> => {
  try {
    const data = await api.ai.reviewSummary(productName, reviews);
    return data.response;
  } catch {
    return "• Unmatched material depth\n• Consistent tailored fit\n• Exceptional archival potential";
  }
};