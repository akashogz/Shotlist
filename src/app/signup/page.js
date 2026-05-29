"use client";
import { useEffect, useState } from "react";
import { Ban, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import AuthNavbar from "@/components/layout/AuthNavbar";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const handleSignUp = useAuthStore((s) => s.handleSignUp);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  const isPasswordValid = password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const allFilled = name.trim() && username.trim() && email.trim() && isEmailValid && isPasswordValid;
    setValid(Boolean(allFilled));
  }, [name, username, email, password]);

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  return (
    <>
      <AuthNavbar />
      <div className="w-full h-dvh flex items-center justify-center text-sm overflow-hidden">
        <img src="/wp10615910.jpg" className="w-full h-dvh fixed -z-10 brightness-30 blur-xs object-cover" alt="" />
        <div className="bg-gradient-to-b from-[#2a2a2a7b] to-[#2a2a2ad1] p-3 md:p-5 rounded-lg flex gap-5 flex-col border border-[#6666669d]">
          <p className="font-bold text-2xl md:text-3xl h-full text-center">Create an Account</p>
          <div className="flex flex-col gap-4 w-70 md:w-120">
            <div className="flex flex-col gap-1">
              <p className="bold">Name</p>
              <input placeholder="John Doe" type="text" className="border focus:outline-0 rounded-lg p-2 w-full border-[#6666669d] focus:border-white/70 bg-transparent" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="bold text-sm">Username</p>
              <input placeholder="johndoe" type="text" className="border focus:outline-0 rounded-lg p-2 w-full border-[#6666669d] focus:border-white/70 bg-transparent" onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="bold text-sm">Email Address</p>
              <input placeholder="example@mail.com" type="email" className="border focus:outline-0 rounded-lg p-2 w-full border-[#6666669d] focus:border-white/70 bg-transparent" onChange={(e) => setMail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="bold text-sm">Password</p>
              <input placeholder="••••••••" type="password" className="border focus:outline-0 rounded-lg p-2 w-full border-[#6666669d] focus:border-white/70 bg-transparent" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { handleSignUp({ name, username, email, password }); } }} />
            </div>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out flex flex-col gap-2 ${password ? "opacity-100 max-h-40" : "opacity-0 max-h-0"}`}>
              <div className="flex gap-2 items-center">{password.length < 8 ? <Ban size={16} color="#f87171" /> : <Check size={16} color="#34d399" />}<p>Should be at least 8 characters</p></div>
              <div className="flex gap-2 items-center">{!/[a-zA-Z]/.test(password) ? <Ban size={16} color="#f87171" /> : <Check size={16} color="#34d399" />}<p>Should contain at least 1 alphabet</p></div>
              <div className="flex gap-2 items-center">{!/\d/.test(password) ? <Ban size={16} color="#f87171" /> : <Check size={16} color="#34d399" />}<p>Should contain at least 1 number</p></div>
            </div>
            <button
              className={`p-3 rounded-lg font-bold text-md ${!valid ? "bg-[#828282]" : "bg-[#464E82] hover:brightness-110 ease-in-out duration-300"}`}
              disabled={!valid}
              onClick={() => { handleSignUp({ name, username, email, password }); router.push("/login"); }}
            >
              Signup
            </button>
            <button onClick={() => { window.location.href = `${apiUrl}/auth/google`; }} className="flex gap-2 bg-white rounded-lg p-3 text-black font-bold items-center justify-center">
              <img src="/google.svg.png" className="size-6" alt="google" />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
