"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
      <div className="max-w-lg w-full p-10 rounded-box shadow-lg bg-base-200 space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Welcome to DaisyUI Dark
        </h1>
        <p className="text-center text-base">
          This is a clean, responsive dark theme using{" "}
          <span className="font-semibold">DaisyUI</span>.
        </p>
        <div className="flex justify-center gap-4">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
        </div>
        <p className="text-center text-sm opacity-70">
          Edit <code>app/page.tsx</code> to get started.
        </p>
      </div>
    </main>
  );
}
