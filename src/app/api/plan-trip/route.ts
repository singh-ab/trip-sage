import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Itinerary = {
  tripSummary: {
    destination: string;
    duration: number;
    totalEstimatedCost: number;
  };
  days: {
    day: number;
    theme: string;
    activities: {
      time: string;
      description: string;
      location?: string;
      cost?: number;
    }[];
  }[];
};

type TripPreferences = {
  destination: string;
  duration: number;
  budget: number;
  interests: string;
};

function buildPrompt(preferences: TripPreferences): string {
  const { destination, duration, budget, interests } = preferences;
  return `You are an expert travel agent specializing in personalized trips in India. Create a detailed, day-by-day travel itinerary based on the following user preferences.

Preferences:
- Destination: ${destination}
- Trip Duration: ${duration} days
- Budget: Approximately ₹${budget}
- Key Interests: ${interests}

Your response must be STRICT JSON (no markdown, no prose outside the JSON object) with the following structure:
{
  "tripSummary": { 
    "destination": "${destination}", 
    "duration": ${duration}, 
    "totalEstimatedCost": number 
  },
  "days": [
    {
      "day": number,
      "theme": "string describing the day's focus",
      "activities": [
        { 
          "time": "e.g., 9:00 AM", 
          "description": "detailed activity description", 
          "location": "specific place name", 
          "cost": number_in_rupees 
        }
      ]
    }
  ]
}

Instructions:
- Create a logical plan for ${duration} days in ${destination}.
- Focus on activities that match: ${interests}.
- Include recommendations for meals, transport, and accommodation suggestions.
- Provide realistic cost estimates for each activity in Indian Rupees (₹).
- Keep the total estimated cost within or slightly below ₹${budget}.
- Include a mix of popular attractions and hidden gems.
- Consider travel time between locations and practical logistics.
- Add local cultural experiences and authentic food recommendations.
- The output must be ONLY the JSON object, no other text.`;
}

async function callGemini(prompt: string): Promise<Itinerary> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  const text = result.response.text();

  // Clean up the response - remove markdown code blocks if present
  let jsonStr = text.trim();
  const match = jsonStr.match(/```json\n([\s\S]*?)\n```/i);
  if (match) jsonStr = match[1];

  try {
    return JSON.parse(jsonStr) as Itinerary;
  } catch {
    console.error("Failed to parse JSON from model:", text);
    throw new Error(
      "The AI model returned an invalid response. Please try again."
    );
  }
}

export async function POST(req: Request) {
  try {
    const preferences = await req.json();

    // Validate required fields
    const requiredFields = ["destination", "duration", "budget", "interests"];
    const missingFields = requiredFields.filter((field) => !preferences[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate data types
    const duration = parseInt(preferences.duration);
    const budget = parseInt(preferences.budget);

    if (isNaN(duration) || duration < 1 || duration > 30) {
      return NextResponse.json(
        { ok: false, error: "Duration must be between 1 and 30 days" },
        { status: 400 }
      );
    }

    if (isNaN(budget) || budget < 1000) {
      return NextResponse.json(
        { ok: false, error: "Budget must be at least ₹1000" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt({
      ...preferences,
      duration,
      budget,
    });

    const itinerary = await callGemini(prompt);

    return NextResponse.json({ ok: true, itinerary });
  } catch (error) {
    console.error("/api/plan-trip error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected error occurred";
    const status = message.includes("GEMINI_API_KEY") ? 500 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
