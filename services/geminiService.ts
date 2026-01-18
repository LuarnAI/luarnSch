
import { GoogleGenAI, Type } from "@google/genai";
import { Course } from "../types";

export const analyzeGrades = async (courses: Course[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const courseSummary = courses.map(c => `${c.name}: ${c.score}分 (${c.credits}學分, 類別: ${c.category})`).join('\n');

  const prompt = `
    你是一位專業的學業指導顧問。請分析以下學生的成績單，並提供深入的分析報告。
    
    成績資料：
    ${courseSummary}
    
    請包含以下內容：
    1. 整體表現評估
    2. 優勢科目分析
    3. 待加強領域建議
    4. 具體的未來學習策略建議
    
    請使用繁體中文回答，語氣要親切且具鼓勵性。
  `;

  try {
    // Upgraded to gemini-3-pro-preview for complex reasoning tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "無法生成分析，請稍後再試。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "分析過程中發生錯誤。";
  }
};

export const getSmartResponse = async (query: string, courses: Course[]): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const context = courses.length > 0 ? `當前成績背景：${courses.map(c => `${c.name}:${c.score}`).join(',')}` : "目前沒有成績資料。";
    
    // Upgraded to gemini-3-pro-preview for high-quality assistant responses
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `你是一個學術助手。用戶問題：${query}\n內容脈絡：${context}`,
    });
    return response.text || "抱歉，我現在無法回答。";
};
