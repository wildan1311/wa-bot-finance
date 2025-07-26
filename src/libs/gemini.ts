import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { systemPrompt } from '../const/prompt.ts';
import { FormattedChat } from "../types/types";


dotenv.config();

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extractText = async (text: string) : Promise<FormattedChat[]> => {
    try {
        const response = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: 'Extract the text from the following content:\n' + text,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: {
                                type: Type.STRING,
                            },
                            nominal: {
                                type: Type.NUMBER,
                            },
                            date: {
                                type: [Type.STRING, Type.NULL], // Allow date to be null if not provided
                            },
                            category: {
                                type: Type.STRING,
                            }
                        },
                    },
                },
            }
        })

        if (!response) {
            return []; // Return an empty array if no content is returned
        }

        const content = response.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
        if (!content) {
            return [];
        }
        return JSON.parse(content) as FormattedChat[];
    } catch (error) {
        console.error("Error extracting text:", error);
        throw error;
    }
}

export {extractText};