
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Gets a detailed, reasoned response from the Gemini 2.5 Pro model.
 * This function is designed for complex queries that benefit from the model's "thinking" capabilities.
 * @param prompt The user's query.
 * @returns The text response from the model.
 */
export const getSmartAnswer = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        // Set max thinking budget to enable deep reasoning for complex tasks.
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while contacting the AI assistant: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI assistant.";
  }
};
