import { GoogleGenAI, Type } from "@google/genai";
import { Plant, Category, Direction, Element, Sunlight, SafetyStatus } from "./types";
import { INITIAL_PLANTS } from "./constants";

const STORAGE_KEY = 'vaastu_flora_db';
const DB_VERSION = 'v18_final_batch_images_fixed';

class ApiService {
  constructor() {}

  /**
   * DATABASE OPERATIONS
   */
  async getAllPlants(): Promise<Plant[]> {
    // Fallback to localStorage
    const data = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem(STORAGE_KEY + '_version');

    if (!data || version !== DB_VERSION) {
      await this.saveAllPlants(INITIAL_PLANTS);
      localStorage.setItem(STORAGE_KEY + '_version', DB_VERSION);
      return INITIAL_PLANTS;
    }
    return JSON.parse(data);
  }

  async saveAllPlants(plants: Plant[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  }

  async resetDatabase(): Promise<Plant[]> {
    await this.saveAllPlants(INITIAL_PLANTS);
    localStorage.setItem(STORAGE_KEY + '_version', DB_VERSION);
    return INITIAL_PLANTS;
  }

  /**
   * AI BACKEND OPERATIONS
   * Uses Gemini to generate structured plant data
   */
  async generatePlantDetails(commonName: string): Promise<Partial<Plant>> {
    // CRITICAL: Always create a new instance right before making an API call to ensure current API key usage.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Provide Vastu Shastra and botanical details for the plant: "${commonName}". 
        Return the data in the specified JSON format. 
        Focus on Sri Lankan context for Sinhala names.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name_si: { type: Type.STRING, description: "Sinhala name of the plant" },
              scientific_name: { type: Type.STRING },
              category: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g. Indoor, Outdoor, Flower" },
              directions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Vastu directions" },
              element: { type: Type.STRING, description: "One of: Earth (පඨවි), Water (ආපෝ), Fire (තේජෝ), Air (වායෝ), Space (ආකාශ)" },
              sunlight: { type: Type.STRING, description: "Low, Medium, or Full" },
              benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
              pet_safe: { type: Type.STRING, description: "Yes, No, or Unknown" },
              kids_safe: { type: Type.STRING, description: "Yes, No, or Unknown" },
              avoid_if_kids_pets: { type: Type.BOOLEAN }
            },
            required: ["name_si", "scientific_name", "element", "sunlight", "benefits"]
          }
        }
      });

      // Use the .text property directly from GenerateContentResponse (do not call as a method).
      const result = JSON.parse(response.text || "{}");
      return result;
    } catch (error) {
      console.error("AI Generation failed:", error);
      throw new Error("Could not connect to AI Backend.");
    }
  }
}

export const api = new ApiService();
