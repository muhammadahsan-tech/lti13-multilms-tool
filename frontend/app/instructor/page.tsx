"use client";

import { useEffect, useState } from "react";

export default function InstructorPage() {
  const [scores, setScores] = useState([]);

  async function fetchScores() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ags/scores`);
    const data = await res.json();
    setScores(data);
  }

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <section className="max-w-5xl rounded-2xl bg-white p-8 shadow text-slate-900">
        <h1 className="mb-6 text-4xl font-bold">
          👨‍🏫 Instructor Dashboard (AGS)
        </h1>

        {scores.length === 0 ? (
          <p className="text-slate-700">No AGS submissions yet</p>
        ) : (
          <table className="w-full border border-slate-300">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Line Item</th>
                <th className="p-3 text-left">Score</th>
                <th className="p-3 text-left">Activity</th>
                <th className="p-3 text-left">Grading</th>
                <th className="p-3 text-left">Time</th>
              </tr>
            </thead>

            <tbody>
              {scores.map((s: any, i) => (
                <tr key={i} className="border-t text-slate-800">
                  <td className="p-3">{s.userId}</td>
                  <td className="p-3">{s.lineItemId}</td>
                  <td className="p-3">
                    {s.scoreGiven}/{s.scoreMaximum}
                  </td>
                  <td className="p-3">{s.activityProgress}</td>
                  <td className="p-3">{s.gradingProgress}</td>
                  <td className="p-3">{s.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}