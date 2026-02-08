import { GoogleGenAI } from "@google/genai";
import { 
  MODEL_TEXT_VISION, 
  MODEL_IMAGE_GEN, 
  SYSTEM_PROMPT_VIDEO_15S, 
  SYSTEM_PROMPT_VIDEO_60S, 
  SYSTEM_PROMPT_SALES_SCRIPT,
  PROMPT_SEPARATE_CLOTHING,
  PROMPT_SEPARATE_PRODUCT
} from "../constants";
import { ImageProcessType, VideoDuration } from "../types";

// Helper to safely get the API Key
const getAIClient = () => {
  // In Vite, we use import.meta.env.
  // We explicitly cast to string or empty string to avoid crashes.
  const apiKey = import.meta.env.VITE_API_KEY as string;
  
  if (!apiKey) {
    console.error("API Key not found. Checked import.meta.env.VITE_API_KEY");
    throw new Error("API Key is missing. Please ensure VITE_API_KEY is set in Vercel and you have Redeployed the app.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Converts a File object to a Base64 string.
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateImageSeparation = async (
  imageFile: File,
  type: ImageProcessType
): Promise<string> => {
  const base64Data = await fileToBase64(imageFile);
  const prompt = type === ImageProcessType.CLOTHING 
    ? PROMPT_SEPARATE_CLOTHING 
    : PROMPT_SEPARATE_PRODUCT;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODEL_IMAGE_GEN,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: imageFile.type,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract image from response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated.");
  } catch (error: any) {
    console.error("Gemini API Error (Image):", error);
    throw new Error(error.message || "Failed to generate image. Please try again.");
  }
};

export const generateVideoPrompt = async (
  imageFile: File,
  duration: VideoDuration,
  extraText: string
): Promise<string> => {
  const base64Data = await fileToBase64(imageFile);
  const systemPrompt = duration === VideoDuration.FIFTEEN_SEC 
    ? SYSTEM_PROMPT_VIDEO_15S 
    : SYSTEM_PROMPT_VIDEO_60S;

  const fullPrompt = `
    ${systemPrompt}
    ${extraText ? `Thông tin bổ sung về sản phẩm: ${extraText}` : ''}
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODEL_TEXT_VISION,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: imageFile.type,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
    });

    return response.text || "No text generated.";
  } catch (error: any) {
    console.error("Gemini API Error (Video Prompt):", error);
    throw new Error(error.message || "Failed to generate video prompt.");
  }
};

export const generateSalesScript = async (productDescription: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODEL_TEXT_VISION,
      contents: {
        parts: [
          {
            text: `${SYSTEM_PROMPT_SALES_SCRIPT}\nMô tả sản phẩm: ${productDescription}`,
          },
        ],
      },
    });

    return response.text || "No script generated.";
  } catch (error: any) {
    console.error("Gemini API Error (Sales Script):", error);
    throw new Error(error.message || "Failed to generate sales script.");
  }
};