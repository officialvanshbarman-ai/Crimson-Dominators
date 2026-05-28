import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-center text-[#12070a]">
      <div className="max-w-md">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#b00020]">
          Crimson Dominators
        </p>
        <h1 className="mt-4 text-4xl font-black">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-[#5f5f66]">
          This page is not part of the Crimson Dominators website.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-[#111111] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b00020]"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
