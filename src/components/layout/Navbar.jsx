"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Search } from "lucide-react";

export default function Navbar() {
  const [profileIsOpen, setProfileIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isLoggedIn = !!user;

  const router = useRouter();
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileIsOpen && profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileIsOpen(false);
      }
      if (searchIsOpen && searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileIsOpen, searchIsOpen]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/search/${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <div className="fixed top-0 w-full h-16 z-40">
      <div className="flex justify-between md:px-20 px-5 items-center h-full">
        <div className="flex gap-2 items-center">
          <img src="/logo.png" className="size-10 rounded-full shadow-xs" alt="logo" />
          <Link href="/" className="font-bold text-2xl md:text-3xl">shotlist</Link>
        </div>

        <div className="hidden md:flex border rounded-full p-1 gap-2 items-center pr-2 shadow-sm w-80">
          <div className="border rounded-full p-2"><Search size={16} /></div>
          <input
            type="text"
            placeholder="Search for anything..."
            className="text-sm focus:outline-none w-full bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="hidden md:flex gap-5 items-center text-sm">
          <Link href="/browse">Browse</Link>
          {isLoggedIn ? (
            <img
              src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.avatarSeed}`}
              className="size-9 rounded-full cursor-pointer"
              onClick={() => setProfileIsOpen(!profileIsOpen)}
              alt="avatar"
            />
          ) : (
            <Link href="/signup">Login / Signup</Link>
          )}
        </div>

        <div className="flex md:hidden gap-4 items-center">
          <img src="/search.png" className="size-7 cursor-pointer" onClick={() => setSearchIsOpen(!searchIsOpen)} alt="search" />
          {isLoggedIn ? (
            <img
              src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.avatarSeed}`}
              className="size-8 rounded-full"
              onClick={() => setProfileIsOpen(!profileIsOpen)}
              alt="avatar"
            />
          ) : (
            <Link href="/signup" className="text-sm">Login</Link>
          )}
        </div>
      </div>

      <div
        ref={profileRef}
        className={`absolute right-5 md:right-20 top-16 rounded-md overflow-hidden transition-all duration-200 z-50 text-sm bg-[#353535]
          ${profileIsOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        <Link href={`/profile/${user?.username}`} className="block px-6 py-2 hover:bg-[#2a2a2a]">Profile</Link>
        <Link href="/browse" className="block md:hidden px-6 py-2 hover:bg-[#2a2a2a]">Browse</Link>
        <Link href="/settings" className="block px-6 py-2 hover:bg-[#2a2a2a]">Settings</Link>
        <button
          className="block w-full text-left px-6 py-2 hover:bg-[#2a2a2a]"
          onClick={() => { logout(); setProfileIsOpen(false); }}
        >
          Sign Out
        </button>
      </div>

      <div
        ref={searchRef}
        className={`md:hidden absolute left-0 right-0 top-16 flex justify-center z-50 ${searchIsOpen ? "flex" : "hidden"}`}
      >
        <div className="flex gap-2 p-1.5 border border-white rounded-full shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent px-2 outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-white text-black px-3 p-2 rounded-full text-xs font-semibold"
            onClick={() => { handleSearch(); setSearchIsOpen(false); }}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
