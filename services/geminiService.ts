
import { GoogleGenAI } from "@google/genai";
import { Admin } from "../types";

export const chatWithAdmin = async (admin: Admin, message: string, history: { role: string, text: string }[]) => {
  // Always initialize a new GoogleGenAI instance right before the call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Define persona using systemInstruction as per guidelines
  const systemInstruction = `You are ${admin.name}, a legendary software architect on the "Source Code Hub" platform. 
Role: ${admin.role}. 
Quote: "${admin.quote}". 
Personality: Professional, futuristic, slightly mysterious, and very knowledgeable. 
You respond to users asking about your projects or general code advice.
Please respond as ${admin.name}. Keep it concise, tech-focused, and in character. 
Avoid generic AI phrases.`;

  // Build the conversation history structure
  const contents = [
    ...history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
    })),
    {
      role: 'user',
      parts: [{ text: message }]
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.9,
      }
    });
    // Use .text property directly, not as a method call
    return response.text || "I am currently analyzing the data. Please standby.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The neural link is unstable. Try again later.";
  }
};
