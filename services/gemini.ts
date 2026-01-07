
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ResearchSession, SearchResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const performResearch = async (query: string, pastContext: string): Promise<ResearchSession> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        text: `You are an advanced AI Research Browser agent. 
        Recent Knowledge Context (Memory): ${pastContext}
        User Query: ${query}`
      }
    ],
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "Perform deep research. Provide a comprehensive summary, cite sources, and extract key facts. If the user asks in Thai, respond in Thai with professional and accurate information."
    }
  });

  const text = response.text || "No response generated.";
  
  const sources: SearchResult[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || "Reference",
    snippet: chunk.web?.snippet || "",
    link: chunk.web?.uri || "#"
  })) || [];

  const memoryExtractionResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ text: `Extract up to 3 short, factual snippets for a memory system from this text. Maintain the language of the source text: ${text}` }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          memories: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["memories"]
      }
    }
  });

  let extractedMemory: string[] = [];
  try {
    const data = JSON.parse(memoryExtractionResponse.text || "{}");
    extractedMemory = data.memories || [];
  } catch (e) {
    console.error("Failed to parse memory extraction", e);
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    query,
    answer: text,
    sources,
    extractedMemory,
    timestamp: Date.now()
  };
};
