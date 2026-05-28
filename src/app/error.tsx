"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-center text-[#12070a]">
      <div className="max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#b00020]">
          Crimson Dominators
        </p>
        <h1 className="mt-4 text-3xl font-black">Something needs attention.</h1>
        <p className="mt-3 text-sm leading-6 text-[#5f5f66]">
          The page could not load correctly. Try again in a moment.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-[#111111] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b00020]"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
