"use client";

import { useState } from "react";
import StoolSelector from "./components/StoolSelector";
import Symptoms from "./components/Symptoms";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [stoolType, setStoolType] = useState<number | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);

  const [form, setForm] = useState({
    stool_color: "brown",
    water_intake: "medium",
    fiber_intake: "medium",
    food_type: "normal",
    stress_level: 0,
    time_since_meal_hours: 3,
  });

  const handleSubmit = async () => {
    if (!stoolType) {
      alert("Please select stool type");
      return;
    }

    const payload = {
      stool_type: stoolType,
      symptoms,
      ...form,
    };

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/predict`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );


      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Gut Health Check</h2>

      <div className="bg-white p-6 rounded shadow space-y-5">
        <StoolSelector value={stoolType} onChange={setStoolType} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium mb-2 text-gray-900">Water Intake</p>
            <select
              className="w-full p-2 border rounded
             text-gray-800 bg-white
             focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) =>
                setForm({ ...form, water_intake: e.target.value })
              }
            >
              <option value="low">Low Water</option>
              <option value="medium">Medium Water</option>
              <option value="high">High Water</option>
            </select>
          </div>
          <div>
            <p className="font-medium mb-2 text-gray-900">Fiber Intake</p>
            <select
              className="w-full p-2 border rounded
             text-gray-800 bg-white
             focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) =>
                setForm({ ...form, fiber_intake: e.target.value })
              }
            >
              <option value="low">Low Fiber</option>
              <option value="medium">Medium Fiber</option>
              <option value="high">High Fiber</option>
            </select>
          </div>
          <div>
            <p className="font-medium mb-2 text-gray-900 mt-4">Food Type</p>
            <select
              className="w-full p-2 border rounded
             text-gray-800 bg-white
             focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setForm({ ...form, food_type: e.target.value })}
            >
              <option value="normal">Normal Food</option>
              <option value="junk">Junk</option>
              <option value="spicy">Spicy</option>
              <option value="oily">Oily</option>
              <option value="dairy">Dairy</option>
              <option value="fiber_rich">Fiber Rich</option>
            </select>
          </div>
          <div>
            <p className="font-medium mb-2 text-gray-900 mt-4">Stool Colour</p>
            <select
              className="w-full p-2 border rounded
             text-gray-800 bg-white
             focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) =>
                setForm({ ...form, stool_color: e.target.value })
              }
            >
              <option value="brown">Brown</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
            </select>
          </div>
        </div>

        <Symptoms selected={symptoms} onChange={setSymptoms} />

        <div className="flex justify-center">
          <button
            onClick={(e) => {
              handleSubmit();

              // ripple effect
              const btn = e.currentTarget;
              const rect = btn.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              const ripple = document.createElement("span");
              ripple.className =
                "absolute rounded-full scale-0 opacity-70 animate-ping pointer-events-none";
              ripple.style.width = ripple.style.height = "120px";
              ripple.style.left = `${x - 60}px`;
              ripple.style.top = `${y - 60}px`;
              ripple.style.background = "white";

              btn.appendChild(ripple);
              setTimeout(() => ripple.remove(), 400);
            }}
            onMouseMove={(e) => {
              const x = e.nativeEvent.offsetX;
              const w = e.currentTarget.offsetWidth;
              const percent = x / w;
              e.currentTarget.style.setProperty("--px", `${percent}`);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
            }}
            className="relative px-6 py-2 rounded bg-gradient-to-br from-emerald-500 to-gray-900 font-bold overflow-hidden transition-all duration-200 active:scale-[0.97]"
            style={{ filter: "none" }}
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, rgba(255,255,255,0) calc(var(--px,0) * 100% - 40px), white, rgba(255,255,255,0) calc(var(--px,0) * 100% + 40px))`,
                opacity: 0.5,
                transition: "0.2s",
              }}
            />
            {`Check Gut Health`}
          </button>
        </div>

        {loading && (
          <p className="text-blue-600 font-medium">Analyzing gut health...</p>
        )}

        {result && (
          <div className="mt-6 p-4 rounded border bg-gray-50">
            {result.status === "success" ? (
              <>
                <h3 className="text-xl font-bold text-green-700">
                  Possible Condition: {result.prediction}
                </h3>

                <p className="mt-2 text-gray-800">
                  Confidence:{" "}
                  <span className="font-semibold">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </p>

                <p className="mt-3 text-sm text-gray-600">
                  {result.disclaimer}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-yellow-600">
                  Insufficient Information
                </h3>

                <p className="mt-2 text-gray-700">{result.message}</p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
