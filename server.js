import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Rate limiting middleware (simple example)
const requestCounts = new Map();
const RATE_LIMIT = 10; // requests per minute
const WINDOW = 60 * 1000; // 1 minute

const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!requestCounts.get(ip)) {
    requestCounts.set(ip, []);
  }
  
  const requests = requestCounts.get(ip).filter(time => now - time < WINDOW);
  
  if (requests.length >= RATE_LIMIT) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  
  requests.push(now);
  requestCounts.set(ip, requests);
  next();
};

function extractJson(text) {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (match && match[1]) {
    return match[1].trim();
  }
  const startIndex = text.indexOf('[');
  const endIndex = text.lastIndexOf(']');
  if (startIndex !== -1 && endIndex !== -1) {
    return text.substring(startIndex, endIndex + 1).trim();
  }
  return text;
}

const formatBudget = (num, vehicleType) => {
  if (vehicleType === 'car') {
    if (num >= 100) return `${(num / 100).toFixed(2)} Crore`;
    return `${num} Lakhs`;
  }
  if (num >= 1) return `${num.toFixed(2)} Lakhs`;
  return `${Math.round(num * 100000) / 1000}k Rupees`;
};

app.post('/api/recommendations', rateLimit, async (req, res) => {
  try {
    const { vehicleType, minBudget, maxBudget, city, state, subType, fuelType, requirements } = req.body;

    // Validate input
    if (!vehicleType || !minBudget || !maxBudget || !city || !state) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const requirementsString = requirements.length > 0 ? `They have the following specific requirements: ${requirements.join(', ')}.` : '';
    const subTypeString = subType !== 'Any' ? `They are looking for a ${subType}. Note: If the user selected 'Scooter / Scooty', this refers to gearless scooters.` : '';
    const fuelTypeString = fuelType !== 'Any' ? `The preferred fuel type is ${fuelType}.` : '';

    const basePrompt = `
        You are an expert on the Indian ${vehicleType} market with access to real-time data using your search tool.
        A user is looking for ${vehicleType} recommendations. Please find the top 2-3 best matches based on their criteria.

        User Criteria:
        - Budget Range (On-Road Price): ₹${formatBudget(minBudget, vehicleType)} to ₹${formatBudget(maxBudget, vehicleType)}.
        - Location: ${city}, ${state}, India.
        ${subTypeString}
        ${fuelTypeString}
        ${requirementsString}

        Instructions:
        1. Use your search tool to get the most accurate and up-to-date information for the specified city and state.
        2. For each recommended ${vehicleType}, provide both the estimated 'exShowroom' price and the estimated 'onRoad' price. The on-road price is critical.
        3. The 'imageUrl' field is MANDATORY. You MUST use your search tool to find a real, high-quality photograph of the vehicle and provide its direct URL. The URL must link directly to an image file (e.g., ending in .jpg or .png).
        4. The 'fuelType' field must be one of: "Petrol", "Diesel", "CNG", "Electric", "Hybrid". For bikes, primarily use "Petrol" or "Electric".
        5. Provide a concise 'reasoning' (2-3 sentences) for why each ${vehicleType} is a great fit.
        6. List 3-4 key 'pros' that align with the user's requirements.
        7. Strictly adhere to the JSON format. The final output MUST be ONLY a single minified JSON array of objects, with no other text or formatting. Every object in the array must contain all the fields shown in the example.
    `;
    
    const carExample = `{"name":"Hyundai Creta SX (O)","price":{"exShowroom":"₹17.5 Lakhs","onRoad":"₹20.1 Lakhs"},"mileage":"18 kmpl","reasoning":"A very popular choice in your budget, offering a premium cabin and a long list of features. Its performance is well-suited for both city and highway driving in India.","pros":["Panoramic Sunroof","Advanced Safety (ADAS)","Large Touchscreen Infotainment","Ventilated Seats"],"imageUrl":"https://images.carandbike.com/car-images/large/hyundai/creta/hyundai-creta.jpg?v=33","fuelType":"Petrol"}`;
    const bikeExample = `{"name":"Royal Enfield Classic 350","price":{"exShowroom":"₹1.9 Lakhs","onRoad":"₹2.2 Lakhs"},"mileage":"41 kmpl","reasoning":"An iconic cruiser with a comfortable riding posture and a powerful engine, perfect for city commutes and highway touring. It has a huge following in India.","pros":["Timeless Design","Comfortable for long rides","Strong Low-end Torque","Dual-channel ABS"],"imageUrl":"https://images.carandbike.com/bike-images/large/royal-enfield/classic-350/royal-enfield-classic-350.jpg?v=48","fuelType":"Petrol"}`;
    
    const prompt = `${basePrompt}\nExample of a single object in the array:\n${vehicleType === 'car' ? carExample : bikeExample}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const rawText = response.text;
    const jsonText = extractJson(rawText);
    
    if (!jsonText) {
      return res.status(500).json({ error: "Failed to extract JSON from the AI's response." });
    }

    const vehicles = JSON.parse(jsonText);
    
    if (!Array.isArray(vehicles)) {
      return res.status(500).json({ error: "Invalid response format from AI. Expected an array." });
    }

    res.json(vehicles);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to get recommendations from AI. Please try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
