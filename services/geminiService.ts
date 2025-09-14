import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// FIX: Per coding guidelines, assuming API_KEY is always set in the environment.
// The check for a missing API key and intermediate variable have been removed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

export const extractTextFromImage = async (
    base64Image: string,
    mimeType: string,
    language?: string,
    promptHint?: string
): Promise<string> => {
    // FIX: Per coding guidelines, assuming API_KEY is always set.
    // The check for a missing API key has been removed.
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };

        let prompt = "Extract all text from this image, maintaining the original structure as much as possible.";
        if (language) {
            prompt += ` The text is primarily in ${language}.`;
        }
        if (promptHint) {
            prompt += ` Additional context to improve accuracy: "${promptHint}".`;
        }

        const textPart = {
            text: prompt,
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to extract text using Gemini API.");
    }
};