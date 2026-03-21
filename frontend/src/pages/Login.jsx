    import React, { useState } from 'react'
    import { useAuthStore } from '../store/authStore';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { useEffect } from "react";

    function Logup() {
        const [email, setMail] = useState("");
        const [password, setPassword] = useState("");
        const handleLogin = useAuthStore((s) => s.handleLogin);
        const user = useAuthStore((s) => s.user);
        const navigate = useNavigate();
        const location = useLocation();
        const params = new URLSearchParams(location.search);
        const verified = params.get("verified");

        useEffect(() => {
            if (user) {
                navigate("/");
            }
        }, [user, navigate]);

        if (verified) {
            return (
                <div className="w-screen h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-5 bg-[#303030] p-5 sm:p-8 rounded-xl shadow-lg w-70 sm:w-[320px]">

                        <h1 className="font-bold text-2xl text-center">
                            Email Verified Successfully!
                        </h1>

                        <p className="text-gray-400 text-center">
                            Your account is now verified. You can log in to continue.
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="bg-[#464E82] w-full p-2 rounded-lg font-semibold hover:bg-[#5a63a0] transition text-sm"
                        >
                            Go to Login
                        </button>

                    </div>
                </div>
            );
        }

        return (
            <div className='w-full h-dvh flex items-center justify-center text-sm '>
                <img src='wp10615910.jpg ' className='w-full h-dvh fixed -z-10 object-cover brightness-30 blur-xs'></img>
                <div className='bg-linear-to-b from-[#2a2a2a7b] to-[#2a2a2ad1] p-3 md:p-5 rounded-lg flex gap-5 flex-col border border-[#6666669d]'>
                    <p className='font-bold text-2xl md:text-3xl h-full text-center'>Log in to Shotlist</p>
                    <div className='flex flex-col gap-4 w-70 md:w-120'>
                        <div className='flex flex-col gap-1'>
                            <p className='bold text-sm'>Email Address</p>
                            <input placeholder='example@mail.com' type='email' className='border focus:outline-0 rounded-lg p-2 w-full border-[#6666669d] focus:border-white/70' onChange={(e) => setMail(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='bold text-sm'>Password</p>
                            <input placeholder='••••••••' type='password' className='border focus:outline-0 rounded-lg p-2 w-full border-[#6666669d] focus:border-white/70' onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") {handleLogin({ email, password });}}}/>
                        </div>
                        <a className='w-full text-center'>Forgot your password?</a>
                        <button className='bg-[#464E82] p-3 rounded-lg font-bold text-md hover:brightness-110 ease-in-out duration-300' onClick={() => handleLogin({ email: email, password: password })}>Login</button>
                        <button onClick={() => { window.location.href = window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/google`; }}
                            className='flex gap-2 bg-white rounded-lg p-3 text-black font-bold items-center justify-center'>
                            <img src='google.svg.png' className='size-6' />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    export default Logup