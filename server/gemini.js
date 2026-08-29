import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export async function generateItinerary(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Define the schema for structured JSON output
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      title: { type: SchemaType.STRING, description: 'A catchy title for the trip' },
      summary: { type: SchemaType.STRING, description: 'A brief summary of the trip' },
      days: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            dayNumber: { type: SchemaType.INTEGER },
            title: { type: SchemaType.STRING, description: 'Theme or title for the day' },
            stops: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.STRING, description: 'Unique identifier for the stop, e.g., a uuid' },
                  name: { type: SchemaType.STRING, description: 'Name of the location or activity' },
                  description: { type: SchemaType.STRING, description: 'Details about what to do there' },
                  duration: { type: SchemaType.STRING, description: 'Estimated duration, e.g., 2 hours' },
                  type: { type: SchemaType.STRING, description: 'Category: attraction, food, transport, or hotel' },
                  tips: { type: SchemaType.STRING, description: 'Useful tips for this stop' }
                },
                required: ['id', 'name', 'description', 'duration', 'type']
              }
            }
          },
          required: ['dayNumber', 'title', 'stops']
        }
      }
    },
    required: ['title', 'summary', 'days']
  };

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });

  const systemInstruction = `You are an expert travel planner. Create a detailed, day-by-day itinerary based on the user's request. 
Generate unique IDs for every stop. Ensure the response matches the JSON schema exactly.`;

  const result = await model.generateContent({
    contents: [
      { role: 'user', parts: [{ text: systemInstruction + '\n\nUser Request: ' + prompt }] }
    ]
  });

  const responseText = result.response.text();
  return JSON.parse(responseText);
}
