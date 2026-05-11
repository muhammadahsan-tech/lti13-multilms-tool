"use client";

import { useEffect, useState } from "react";

export default function LaunchContextPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchLaunchContext() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/launch-context?role=Instructor`
      );
      const json = await res.json();
      setData(json);
    }

    fetchLaunchContext();
  }, []);

  if (!data) {
    return <main className="p-10">Loading launch context...</main>;
  }

  const context =
    data.decoded["https://purl.imsglobal.org/spec/lti/claim/context"];

  const roles =
    data.decoded["https://purl.imsglobal.org/spec/lti/claim/roles"];

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <section className="max-w-5xl rounded-2xl bg-white p-8 shadow text-slate-900">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          Decoded LTI JWT
        </span>

        <h1 className="mt-6 text-4xl font-bold">🔐 Launch Context</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="font-semibold">User</p>
            <p>{data.decoded.name}</p>
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            <p className="font-semibold">Course</p>
            <p>{context.title}</p>
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            <p className="font-semibold">Issuer</p>
            <p>{data.decoded.iss}</p>
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            <p className="font-semibold">Role</p>
            <p>{roles[0]}</p>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-bold">Signed JWT</h2>
        <pre className="mt-3 overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          {data.token}
        </pre>

        <h2 className="mt-8 text-2xl font-bold">Decoded Payload</h2>
        <pre className="mt-3 overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
          {JSON.stringify(data.decoded, null, 2)}
        </pre>
      </section>
    </main>
  );
}