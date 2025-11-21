import { GoogleGenAI, Chat } from "@google/genai";
import { AZARA_SYSTEM_INSTRUCTION } from '../constants';

let client: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.warn("API Key not found in environment");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const initializeChat = async () => {
  const ai = getClient();
  try {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: AZARA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return true;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return false;
  }
};

export const sendMessageToAzara = async (message: string, image?: { data: string, mimeType: string }): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }
  
  if (!chatSession) {
    return "Error: AZARA is offline. Please check your internet connection or API Key.";
  }

  try {
    let result;
    if (image) {
      // If there is an image, we send a multimodal message
      const imagePart = {
        inlineData: {
          mimeType: image.mimeType,
          data: image.data
        }
      };
      const textPart = { text: message };
      
      // Chat sessions in the SDK support sendMessage with parts
      result = await chatSession.sendMessage({ 
        content: { parts: [imagePart, textPart] }
      });
    } else {
      result = await chatSession.sendMessage({ message });
    }

    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the medical database right now. Please try again.";
  }
};