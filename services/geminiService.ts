import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function scanStudentList(fileBase64: string, mimeType: string): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              text: "Extract all student names from this list image or PDF. Return ONLY a JSON array of strings containing the full names. Important: Clean the names (uppercase, remove numbers/symbols). Example return: [\"ALICE SOUZA\", \"JOÃO SILVA\"]"
            },
            {
              inlineData: {
                data: fileBase64,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    try {
      const names = JSON.parse(text);
      return Array.isArray(names) ? names : [];
    } catch (e) {
      console.error("Error parsing Gemini response:", e);
      return [];
    }
  } catch (error) {
    console.error("Gemini Scan Error:", error);
    throw error;
  }
}
