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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/grade`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "user-12345",
            score,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit score");
      }

      setResult(`Score submitted successfully: ${data.score}%`);
    } catch (error) {
      setResult("Error submitting score");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <section className="max-w-3xl rounded-2xl bg-white p-8 shadow">
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          Student View
        </span>

        <h1 className="mt-6 text-4xl font-bold">🎓 Student Activity</h1>

        <p className="mt-4 text-slate-600">
          Complete this LMS-connected activity and submit a simulated score to
          the backend grade service.
        </p>

        <button
          onClick={submitScore}
          disabled={loading}
          className="mt-8 rounded-xl bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Complete Activity"}
        </button>

        {result && (
          <p className="mt-6 rounded-xl bg-slate-100 p-4 font-medium">
            {result}
          </p>
        )}
      </section>
    </main>
  );
}