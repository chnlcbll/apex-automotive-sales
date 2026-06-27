import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.AUTO_KEY || process.env.GEMINI_API_KEY });

// API Routes
app.post("/api/expert", async (req, res) => {
  try {
    const { vehicles } = req.body;
    
    // Formatting helper
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(amount);
    };

    const prompt = `I am looking at the following vehicles:
    ${vehicles.map((v: any) => `- ${v.name} (${v.year}): ${formatCurrency(v.price)}`).join('\n')}
    
    Provide a deep, expert analysis comparing these vehicles. 
    Consider reliability, performance, resale value in the Philippines, and overall value for money.
    Which one would you recommend for a premium car shop customer?`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    res.json({ text: response.text || "Unable to generate expert advice at this time." });
  } catch (error) {
    console.error("Expert advice failed:", error);
    res.status(500).json({ error: "Expert analysis is currently unavailable." });
  }
});

app.post("/api/generate-image", async (req, res) => {
  try {
    const { carName, color, year } = req.body;
    const prompt = `A highly accurate, professional studio photograph of a ${year} ${carName} in ${color} color. It MUST exactly be a ${carName}. High-end automotive photography, sleek lighting, photorealistic, 4k resolution. Do not hallucinate a different car brand or model.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return res.json({ imageUrl: `data:image/png;base64,${part.inlineData.data}` });
      }
    }
    res.json({ imageUrl: null });
  } catch (error) {
    console.error("Image generation failed:", error);
    res.status(500).json({ error: "Image generation failed." });
  }
});

app.post("/api/search", async (req, res) => {
  try {
    const { query, year, color, seats, vehicleType, transmission } = req.body;
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
              colors: { type: Type.ARRAY, items: { type: Type.STRING } },
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
    if (!text) return res.json({ vehicles: [] });
    res.json({ vehicles: JSON.parse(text) });
  } catch (error: any) {
    console.error("Vehicle search failed:", error);
    res.status(500).json({ error: "Vehicle search failed.", details: error?.message || error?.toString() });
  }
});

// Start Server or Export for Vercel
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if we are not running inside a Vercel serverless function
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
