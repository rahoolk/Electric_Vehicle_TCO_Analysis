
import { GoogleGenAI } from "@google/genai";
import { TcoConfig } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const createPrompt = (evName: string, gasName: string) => `
Based on the latest available data from Google Search, provide vehicle ownership costs in the United States for a "${evName}" and a "${gasName}".
If specific data for these models is not available, provide the national average values for a typical new EV and a typical new gasoline car.
Return the data as a single JSON object inside a markdown code block. Do not include any text outside of the markdown block.
The JSON object must have the following structure and keys, with realistic number values:
{
  "ev": {
    "purchasePrice": 57000,
    "incentives": 7500,
    "efficiency": 3.5,
    "energyCost": 0.17,
    "maintenance": 950,
    "repairs": 500,
    "insurance": 2100
  },
  "gas": {
    "purchasePrice": 48000,
    "efficiency": 25,
    "energyCost": 3.60,
    "maintenance": 1200,
    "repairs": 800,
    "insurance": 1900
  }
}

The keys represent:
- purchasePrice: Average new vehicle purchase price in USD for the specified model, or a national average.
- incentives: Average federal/state incentives for the specified new EV in USD, or a national average.
- efficiency: For EV, miles per kWh. For Gas, miles per gallon (MPG).
- energyCost: For EV, cost per kWh in USD. For Gas, cost per gallon in USD. (National averages are fine here).
- maintenance: Average annual maintenance cost in USD for the specified model, or a national average.
- repairs: Average annual repair cost in USD for the specified model, or a national average.
- insurance: Average annual insurance cost in USD for the specified model, or a national average.
`;

export const fetchNationalAverages = async (evName: string, gasName: string): Promise<Partial<TcoConfig>> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: createPrompt(evName, gasName),
            config: {
              tools: [{googleSearch: {}}],
            },
        });

        const text = response.text;
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);

        if (!jsonMatch || !jsonMatch[1]) {
            throw new Error("Could not parse JSON from Gemini response.");
        }

        const parsedData = JSON.parse(jsonMatch[1]);

        return {
            ev: {
                // FIX: Add missing 'name' property to satisfy VehicleConfig type.
                name: evName,
                purchasePrice: parsedData.ev.purchasePrice,
                incentives: parsedData.ev.incentives,
                efficiency: parsedData.ev.efficiency,
                energyCost: parsedData.ev.energyCost,
                maintenance: parsedData.ev.maintenance,
                repairs: parsedData.ev.repairs,
                insurance: parsedData.ev.insurance,
            },
            gas: {
                // FIX: Add missing 'name' property to satisfy VehicleConfig type.
                name: gasName,
                purchasePrice: parsedData.gas.purchasePrice,
                incentives: 0, // Not applicable for gas cars
                efficiency: parsedData.gas.efficiency,
                energyCost: parsedData.gas.energyCost,
                maintenance: parsedData.gas.maintenance,
                repairs: parsedData.gas.repairs,
                insurance: parsedData.gas.insurance,
            }
        };
    } catch (error) {
        console.error("Error fetching national averages from Gemini:", error);
        throw new Error("Failed to fetch data from Gemini. Please check your API key and try again.");
    }
};
