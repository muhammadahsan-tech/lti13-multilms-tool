"use client";

import { useState } from "react";

export default function StudentPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitScore() {
    setLoading(true);
    setResult("");

    const score = Math.floor(Math.random() * 41) + 60;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ags/scores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "user-12345",
            lineItemId: "lineitem-001",
            scoreGiven: score,
            scoreMaximum: 100,
            activityProgress: "Completed",
            gradingProgress: "FullyGraded",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit AGS score");
      }

      setResult(
        `AGS score submitted: ${data.scoreRecord.scoreGiven}/${data.scoreRecord.scoreMaximum} — ${data.scoreRecord.gradingProgress}`
      );
    } catch (error) {
      setResult("Error submitting AGS score");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <section className="max-w-3xl rounded-2xl bg-white p-8 shadow text-slate-900">
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          Student View
        </span>

        <h1 className="mt-6 text-4xl font-bold text-slate-900">
          🎓 Student Activity
        </h1>

        <p className="mt-4 text-slate-700">
          Complete this LMS-connected activity and submit a simulated LTI
          Advantage AGS score to the backend.
        </p>

        <button
          onClick={submitScore}
          disabled={loading}
          className="mt-8 rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Complete Activity"}
        </button>

        {result && (
          <p className="mt-6 rounded-xl bg-slate-100 p-4 font-medium text-slate-800">
            {result}
          </p>
        )}
      </section>
    </main>
  );
}