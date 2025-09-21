# Personalized AI Trip Planner

An AI-powered trip planning application that generates personalized, end-to-end travel itineraries tailored to individual budgets, interests, and preferences using Google's Gemini AI.

## 🎯 Features

- **Personalized Itineraries**: Generate day-by-day travel plans based on your destination, budget, duration, and interests
- **AI-Powered Recommendations**: Uses Gemini 2.5 Flash to create intelligent, contextual travel suggestions
- **Budget-Aware Planning**: Keeps recommendations within your specified budget with detailed cost breakdowns
- **Interest-Based Customization**: Adapts to your preferences (heritage, nightlife, adventure, food, beaches, etc.)
- **Detailed Scheduling**: Provides time-specific activities with locations and estimated costs
- **Indian Travel Focus**: Specialized for destinations within India with local insights

## 🚀 Getting Started

1. **Install dependencies:**

```bash
npm install
# or
yarn install
```

1. **Set up environment:**

   - Copy `.env.local.example` to `.env.local`
   - Add your Gemini API key: `GEMINI_API_KEY=your_key_here`
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

1. **Run the development server:**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## 🎯 How to Use

1. **Enter Destination**: Specify where you want to travel (e.g., "Goa, India")
2. **Set Duration**: Choose how many days you'll be traveling (1-30 days)
3. **Define Budget**: Enter your budget in Indian Rupees (₹)
4. **Share Interests**: Describe what you enjoy (heritage sites, nightlife, adventure, food, etc.)
5. **Generate**: Click "Generate Itinerary" and get your personalized travel plan!

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes (serverless functions)
- **AI**: Google Gemini 2.5 Flash via `@google/generative-ai`
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting platform

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment

Create `.env.local` from `.env.local.example` and set `GEMINI_API_KEY` for the Gemini API.

## Deploy

Standard Next.js deployment applies. Ensure `GEMINI_API_KEY` is configured on the hosting platform.
