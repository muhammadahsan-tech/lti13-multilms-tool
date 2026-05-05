export default function InstructorPage() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">👨‍🏫 Instructor Dashboard</h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded bg-slate-100 p-4">24 Launches</div>
        <div className="rounded bg-slate-100 p-4">18 Completions</div>
        <div className="rounded bg-slate-100 p-4">86% Avg Score</div>
      </div>
    </main>
  );
}