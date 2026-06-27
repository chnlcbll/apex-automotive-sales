import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Vehicle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getExpertAdvice(vehicles: Vehicle[]): Promise<string> {
  const prompt = `I am looking at the following vehicles:
  ${vehicles.map(v => `- ${v.name} (${v.year}): ${formatCurrency(v.price)}`).join('\n')}
  
  Provide a deep, expert analysis comparing these vehicles. 
  Consider reliability, performance, resale value in the Philippines, and overall value for money.
  Which one would you recommend for a premium car shop customer?`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    return response.text || "Unable to generate expert advice at this time.";
  } catch (error) {
    console.error("Expert advice failed:", error);
    return "Expert analysis is currently unavailable.";
  }
}

// Helper for formatting in prompt
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

export async function generateCarImage(carName: string, color: string, year: string): Promise<string | null> {
  const prompt = `A professional studio photograph of a ${year} ${carName} in ${color} color. High-end automotive photography, sleek lighting, 4k resolution.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
}

export async function searchVehicles(
  query?: string, 
  year?: string, 
  color?: string,
  seats?: string,
  vehicleType?: string,
  transmission?: string
): Promise<Vehicle[]> {
  const prompt = `Search for real-world vehicles matching the following criteria:
  ${query ? `- Model/Name: ${query}` : "- Model/Name: Any"}
  ${year ? `- Year: ${year}` : ""}
  ${color ? `- Color: ${color}` : ""}
  ${seats ? `- Seats: ${seats}` : ""}
  ${vehicleType ? `- Type: ${vehicleType}` : ""}
  ${transmission ? `- Transmission: ${transmission}` : ""}
  
  Provide a list of exactly 3 matching vehicles with their estimated market prices in Philippine Pesos (PHP).
  For each vehicle, provide a high-quality image URL that is accurate to the make and model.
  Return the data as a JSON array of objects with the following properties:
  - name: string (Full make and model)
  - price: number (Estimated price in PHP)
  - year: string (Model year)
  - colors: string[] (List of available colors)
  - description: string (Brief 1-sentence highlight)
  - imageUrl: string (Accurate image URL of the car)
  - seats: number (Number of seats)
  - type: string (Vehicle type like SUV, Sedan, etc.)
  - transmission: string (Transmission type like Automatic, Manual, CVT, etc.)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              price: { type: Type.NUMBER },
              year: { type: Type.STRING },
              colors: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              description: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              seats: { type: Type.NUMBER },
              type: { type: Type.STRING },
              transmission: { type: Type.STRING }
            },
            required: ["name", "price", "year", "colors", "imageUrl", "seats", "type", "transmission"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Vehicle search failed:", error);
    return [];
  }
}
