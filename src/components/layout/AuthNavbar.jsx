"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthNavbar() {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 w-full z-10 items-center h-16 -mb-18 pt-0.5">
      <div className="flex justify-between md:px-20 px-5 mt-2 mb-2 z-10 items-center">
        <div className="flex gap-2 items-center justify-center">
          <img src="/logo.png" className="size-10 object-fill rounded-full shadow-2xl" alt="logo" />
          <Link href="/" className="font-bold text-2xl md:text-3xl shadow-2xl">shotlist</Link>
        </div>
        <div className="md:flex gap-5 font-light items-center text-[14px]">
          {pathname === "/signup"
            ? <Link href="/login" className="text-sm font-semibold shadow-2xl border p-2 px-3 rounded-lg border-[#6666669d]">Log In</Link>
            : <Link href="/signup" className="text-sm font-semibold shadow-2xl border p-2 px-3 rounded-lg border-[#6666669d]">Sign Up</Link>
          }
        </div>
      </div>
    </div>
  );
}
