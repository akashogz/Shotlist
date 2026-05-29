import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="text-6xl font-black">404</h1>

      <h2 className="text-2xl font-bold">
        Page Not Found
      </h2>

      <p className="text-white/60 max-w-md">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <Link
        href="/"
        className="bg-[#464E82] px-5 py-3 rounded-full font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}