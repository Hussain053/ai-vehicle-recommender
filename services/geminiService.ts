import type { Vehicle, UserInput } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';



export const getVehicleRecommendations = async (userInput: UserInput): Promise<Vehicle[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInput),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get recommendations');
        }

        const vehicles = await response.json();
        
        if (!Array.isArray(vehicles)) {
            throw new Error("Invalid response format from API. Expected an array.");
        }

        return vehicles as Vehicle[];

    } catch (error) {
        console.error("Error fetching vehicle recommendations:", error);
        if (error instanceof TypeError) {
            throw new Error("Unable to connect to the server. Please ensure the backend is running.");
        }
        throw error instanceof Error 
            ? error 
            : new Error("Failed to get recommendations from AI. Please try again.");
    }
};

export const getVehicleComparison = async (userInput: UserInput, vehicleToCompare: Vehicle): Promise<Vehicle[]> => {
    const { vehicleType, minBudget, maxBudget, city, state, subType, fuelType, requirements } = userInput;
    
    const requirementsString = requirements.length > 0 ? `Original requirements: ${requirements.join(', ')}.` : '';
    const subTypeString = subType !== 'Any' ? `They were looking for a ${subType}.` : '';
    const fuelTypeString = fuelType !== 'Any' ? `Preferred fuel type was ${fuelType}.` : '';

    const basePrompt = `
        You are an expert on the Indian ${vehicleType} market with access to real-time search data.
        A user is considering buying a "${vehicleToCompare.name}" and wants to see how it compares to its key competitors.

        User's Original Criteria:
        - Budget Range (On-Road Price): ₹${formatBudget(minBudget, vehicleType)} to ₹${formatBudget(maxBudget, vehicleType)}.
        - Location: ${city}, ${state}, India.
        ${subTypeString}
        ${fuelTypeString}
        ${requirementsString}

        Your Task:
        Find the top 2-3 strongest competitors for the "${vehicleToCompare.name}" that also fit the user's original criteria.

        Instructions:
        1.  Use your search tool to get the most accurate and up-to-date information for the specified city and state.
        2.  For each competitor, provide both the estimated 'exShowroom' price and the estimated 'onRoad' price.
        3.  The 'imageUrl' field is MANDATORY. Find a real, high-quality photograph of the vehicle.
        4.  The 'reasoning' field should explain *why* this vehicle is a strong competitor or a good alternative to the "${vehicleToCompare.name}", considering the user's criteria.
        5.  List 3-4 key 'pros' for each competitor.
        6.  Strictly adhere to the JSON format. The final output MUST be ONLY a single minified JSON array of objects.
    `;
    
    const carExample = `{"name":"Kia Seltos HTX","price":{"exShowroom":"₹16.7 Lakhs","onRoad":"₹19.2 Lakhs"},"mileage":"17 kmpl","reasoning":"The Seltos is a direct rival to the Creta, often praised for its sportier design and feature-packed interior. It offers a slightly different driving experience that some prefer.","pros":["Stylish Exterior Design","Feature-rich cabin","Multiple Engine/Gearbox options","Sharp Handling"],"imageUrl":"https://images.carandbike.com/car-images/large/kia/seltos/kia-seltos.jpg?v=45","fuelType":"Petrol"}`;
    const bikeExample = `{"name":"Jawa 42 Bobber","price":{"exShowroom":"₹2.1 Lakhs","onRoad":"₹2.4 Lakhs"},"mileage":"30 kmpl","reasoning":"This is a strong alternative to the Classic 350, offering a unique bobber style and a more modern, liquid-cooled engine for better performance.","pros":["Unique Bobber Styling","Liquid-cooled Engine","Comfortable solo seat","Good city performance"],"imageUrl":"https://images.carandbike.com/bike-images/large/jawa/42-bobber/jawa-42-bobber.jpg?v=1","fuelType":"Petrol"}`;
    
    const prompt = `${basePrompt}\nExample of a single object in the array:\n${vehicleType === 'car' ? carExample : bikeExample}`;

    try {
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
            throw new Error("Failed to extract JSON from the AI's comparison response.");
        }

        const vehicles = JSON.parse(jsonText);
        
        if (!Array.isArray(vehicles)) {
            throw new Error("Invalid comparison response format from AI. Expected an array.");
        }

        return vehicles as Vehicle[];

    } catch (error) {
        console.error("Error fetching or parsing vehicle comparison:", error);
        if (error instanceof SyntaxError) {
          throw new Error("Failed to parse the comparison from the AI. The format was invalid. Please try again.");
        }
        throw new Error("Failed to get a comparison from the AI. Please try again.");
    }
};
