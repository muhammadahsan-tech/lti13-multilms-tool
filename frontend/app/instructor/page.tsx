"use client";

import { useEffect, useState } from "react";

export default function InstructorPage() {
  const [scores, setScores] = useState([]);

  async function fetchScores() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/ags/scores`
    );
    const data = await res.json();
    setScores(data);
  }

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <section className="max-w-5xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-4xl font-bold mb-6">
          👨‍🏫 Instructor Dashboard (AGS)
        </h1>

        {scores.length === 0 ? (
          <p>No AGS submissions yet</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-slate-200">
                <th className="p-2">User</th>
                <th className="p-2">Line Item</th>
                <th className="p-2">Score</th>
                <th className="p-2">Activity</th>
                <th className="p-2">Grading</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s: any, i) => (
                <tr key={i} className="text-center border-t">
                  <td className="p-2">{s.userId}</td>
                  <td className="p-2">{s.lineItemId}</td>
                  <td className="p-2">
                    {s.scoreGiven}/{s.scoreMaximum}
                  </td>
                  <td className="p-2">{s.activityProgress}</td>
                  <td className="p-2">{s.gradingProgress}</td>
                  <td className="p-2">{s.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}