"use client";

export default function Error({
  error,
  reset,
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="text-3xl font-bold">
        Something went wrong
      </h1>

      <p className="text-white/60">
        {error?.message}
      </p>

      <button
        onClick={() => reset()}
        className="bg-[#464E82] px-5 py-3 rounded-full font-semibold"
      >
        Try Again
      </button>
    </div>
  );
}