"use client";

import { useEffect, useState } from "react";

export default function InstructorPage() {
  const [grades, setGrades] = useState([]);

  async function fetchGrades() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/grades`
    );
    const data = await res.json();
    setGrades(data);
  }

  useEffect(() => {
    fetchGrades();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <section className="max-w-4xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-4xl font-bold mb-6">👨‍🏫 Instructor Dashboard</h1>

        {grades.length === 0 ? (
          <p>No submissions yet</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-slate-200">
                <th className="p-2">User</th>
                <th className="p-2">Score</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g: any, i) => (
                <tr key={i} className="text-center border-t">
                  <td className="p-2">{g.userId}</td>
                  <td className="p-2">{g.score}</td>
                  <td className="p-2">{g.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}