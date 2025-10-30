import { GoogleGenAI, Type } from "@google/genai";

// IMPORTANT: In a real production application, the API key should be handled on a secure backend server
// and not exposed in the frontend code. This is for demonstration purposes only.
// The key is accessed via process.env.API_KEY, which is assumed to be configured in the build environment.
const API_KEY = process.env.API_KEY;

// Fix: Conditionally initialize GoogleGenAI to prevent a crash if the API key is missing.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
    console.warn("Gemini API key not found. Please set the API_KEY environment variable. AI features will be disabled.");
}

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return `حدث خطأ أثناء الاتصال بـ Gemini: ${error.message}`;
    }
    return "حدث خطأ غير معروف أثناء إنشاء المحتوى.";
};

export const generateText = async (prompt: string): Promise<string> => {
    // Fix: Return an error message if the AI client was not initialized.
    if (!ai) {
        return "خطأ: مفتاح Gemini API غير متوفر. يرجى تكوين متغير البيئة.";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating text with Gemini:", error);
        return getErrorMessage(error);
    }
};

export const generateTextWithImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    if (!ai) {
        return "خطأ: مفتاح Gemini API غير متوفر.";
    }

    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType,
            },
        };

        const textPart = {
            text: prompt,
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: 'عنوان جذاب للحملة الإعلانية' },
                        description: { type: Type.STRING, description: 'وصف قصير ومقنع للمنتج' },
                    },
                    required: ["name", "description"],
                }
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error generating text with image using Gemini:", error);
        return getErrorMessage(error);
    }
};