"use client";

import { useMemo, useState } from "react";

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

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  // Controlled form state for better UX, sharing, and validation
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState<number>(7);
  const [budget, setBudget] = useState<number>(50000);
  const [interestsInput, setInterestsInput] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("English");
  const [startDate, setStartDate] = useState<string>("");
  const [pace, setPace] = useState<"relaxed" | "balanced" | "packed">(
    "balanced"
  );
  const [travelMode, setTravelMode] = useState<
    "walk" | "public" | "car" | "mixed"
  >("mixed");
  const [dietary, setDietary] = useState<string>("");

  // Derive combined interests
  const interests = useMemo(() => {
    const manual = interestsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const all = Array.from(new Set([...selectedInterests, ...manual]));
    return all.join(", ");
  }, [selectedInterests, interestsInput]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setItinerary(null);
    setLoading(true);

    try {
      const body = {
        destination,
        duration,
        budget,
        interests,
        language,
        startDate,
        pace,
        travelMode,
        dietary,
      };
      const res = await fetch("/api/plan-trip", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || `Request failed: ${res.status}`);
      }
      setItinerary(data.itinerary as Itinerary);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white pt-4">
      <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Trip Planner
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Generate personalized itineraries tailored to your budget,
            interests, and travel style
          </p>

          {/* Quick start with popular destinations */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3">
              Quick start with popular destinations:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { name: "Goa", interests: ["beaches", "nightlife", "food"] },
                { name: "Jaipur", interests: ["heritage", "shopping", "food"] },
                { name: "Kerala", interests: ["beaches", "wildlife", "food"] },
                {
                  name: "Manali",
                  interests: ["adventure", "trekking", "temples"],
                },
                {
                  name: "Rishikesh",
                  interests: ["adventure", "temples", "trekking"],
                },
              ].map((dest) => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => {
                    setDestination(`${dest.name}, India`);
                    setSelectedInterests(dest.interests);
                    setBudget(45000);
                    setDuration(5);
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {dest.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-6 bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Destination
              </label>
              <input
                name="destination"
                placeholder="e.g., Goa, India"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Duration (days)
              </label>
              <input
                name="duration"
                type="number"
                min={1}
                max={30}
                placeholder="7"
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Budget slider + number input */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Budget (INR)
            </label>
            <div className="flex items-center gap-6">
              <input
                type="range"
                min={1000}
                max={200000}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                    ((budget - 1000) / (200000 - 1000)) * 100
                  }%, #e5e7eb ${
                    ((budget - 1000) / (200000 - 1000)) * 100
                  }%, #e5e7eb 100%)`,
                }}
              />
              <input
                name="budget"
                type="number"
                min={1000}
                step={500}
                placeholder="50000"
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-40 border-2 border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>₹1,000</span>
              <span className="font-medium text-blue-600">
                ₹{budget.toLocaleString()}
              </span>
              <span>₹2,00,000</span>
            </div>
          </div>

          {/* Interests chips + free text */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">
              Interests & Preferences
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                "heritage",
                "nightlife",
                "adventure",
                "food",
                "beaches",
                "shopping",
                "temples",
                "wildlife",
                "trekking",
              ].map((tag) => {
                const active = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedInterests((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <input
              name="interests"
              placeholder="Add more interests (comma-separated)"
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Language + Start date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {[
                  "English",
                  "Hindi",
                  "Bengali",
                  "Tamil",
                  "Telugu",
                  "Marathi",
                ].map((l) => (
                  <option key={l} value={l} className="text-gray-900">
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Pace & Travel Mode & Dietary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Pace
              </label>
              <div className="flex gap-2">
                {[
                  { k: "relaxed", label: "Relaxed" },
                  { k: "balanced", label: "Balanced" },
                  { k: "packed", label: "Packed" },
                ].map((p) => (
                  <button
                    key={p.k}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Pace clicked:", p.k, "Current pace:", pace);
                      setPace(p.k as typeof pace);
                    }}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer select-none ${
                      pace === p.k
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                    style={{
                      pointerEvents: "auto",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Travel Mode
              </label>
              <select
                value={travelMode}
                onChange={(e) =>
                  setTravelMode(e.target.value as typeof travelMode)
                }
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="mixed" className="text-gray-900">
                  Mixed
                </option>
                <option value="walk" className="text-gray-900">
                  Walk First
                </option>
                <option value="public" className="text-gray-900">
                  Public Transport
                </option>
                <option value="car" className="text-gray-900">
                  Car/Taxi
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Dietary
              </label>
              <input
                placeholder="e.g., vegetarian, vegan, halal"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg px-8 py-4 text-lg font-semibold disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? "Planning Your Trip..." : "Generate Itinerary"}
          </button>
        </form>
        {error && (
          <div className="text-red-700 border-2 border-red-300 bg-red-50 p-4 rounded-lg shadow-sm">
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        )}
        {itinerary && (
          <section className="bg-gray-50 rounded-lg shadow-md p-6 space-y-6 border border-gray-200">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-blue-800">
                Your Trip to {itinerary.tripSummary.destination}
              </h2>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  <strong>Duration:</strong> {itinerary.tripSummary.duration}{" "}
                  days
                </span>
                <span>
                  <strong>Estimated Cost:</strong> ₹
                  {itinerary.tripSummary.totalEstimatedCost.toLocaleString()}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded border hover:bg-gray-50"
                >
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => exportICS(itinerary, startDate)}
                  className="px-3 py-2 rounded border hover:bg-gray-50"
                  disabled={!startDate}
                >
                  Export .ics {startDate ? "" : "(set start date)"}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {itinerary.days.map((day) => (
                <div key={day.day} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Day {day.day}: {day.theme}
                  </h3>
                  <div className="space-y-2">
                    {day.activities.map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="text-blue-600 font-medium text-sm min-w-0 shrink-0">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-800">
                            {activity.description}
                          </div>
                          {activity.location && (
                            <div className="text-sm text-gray-600 mt-1">
                              📍 {activity.location}
                            </div>
                          )}
                          {activity.cost && (
                            <div className="text-sm text-green-600 mt-1">
                              💰 ₹{activity.cost}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// Helper: Export itinerary to .ics calendar file (naive parser for times)
function exportICS(it: Itinerary, startDate: string) {
  if (!startDate) return;
  const dtStart = new Date(startDate + "T00:00:00");
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(
      d.getUTCDate()
    )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const parseTime = (s?: string, idx?: number) => {
    if (!s) return { h: 10 + (idx || 0) * 2, m: 0 };
    // Try parse formats like "9:00 AM", "14:30"
    const ampm = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(s.trim());
    if (ampm) {
      let h = Number(ampm[1]) % 12;
      const m = Number(ampm[2] || 0);
      if (ampm[3].toUpperCase() === "PM") h += 12;
      return { h, m };
    }
    const hm = /^(\d{1,2})(?::(\d{2}))?$/.exec(s.trim());
    if (hm) return { h: Number(hm[1]), m: Number(hm[2] || 0) };
    return { h: 10 + (idx || 0) * 2, m: 0 };
  };

  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AI Trip Planner//EN\n";
  it.days.forEach((day) => {
    day.activities.forEach((act, i) => {
      const d = new Date(dtStart);
      d.setDate(dtStart.getDate() + (day.day - 1));
      const t = parseTime(act.time, i);
      d.setHours(t.h, t.m, 0, 0);
      const d2 = new Date(d);
      d2.setHours(d.getHours() + 1);
      const title = act.description.replace(/\n/g, " ");
      const loc = act.location ? act.location.replace(/\n/g, " ") : "";
      ics += `BEGIN:VEVENT\nSUMMARY:${title}\nDTSTART:${fmt(d)}\nDTEND:${fmt(
        d2
      )}\nLOCATION:${loc}\nEND:VEVENT\n`;
    });
  });
  ics += "END:VCALENDAR\n";

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `itinerary-${Date.now()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
