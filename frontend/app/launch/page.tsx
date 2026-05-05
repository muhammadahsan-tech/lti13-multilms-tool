export default function LaunchPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <section className="max-w-4xl rounded-2xl bg-white p-8 shadow">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          LTI 1.3 Launch
        </span>

        <h1 className="mt-6 text-4xl font-bold">
          🚀 LTI 1.3 Learning Tool
        </h1>

        <p className="mt-4 text-slate-600">
          This React/Next.js frontend displays LMS launch context, user role,
          course information, and tool activity data.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <a
            href="/instructor"
            className="rounded-xl border p-6 hover:bg-slate-50"
          >
            <h2 className="text-xl font-semibold">Instructor Dashboard</h2>
            <p className="mt-2 text-slate-600">
              View launches, completions, and grade activity.
            </p>
          </a>

          <a
            href="/student"
            className="rounded-xl border p-6 hover:bg-slate-50"
          >
            <h2 className="text-xl font-semibold">Student Activity</h2>
            <p className="mt-2 text-slate-600">
              Complete a learning activity and submit a simulated score.
            </p>
          </a>
        </div>
      </section>
    </main>
  );
}