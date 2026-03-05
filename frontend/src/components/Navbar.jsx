import { use, useEffect, useRef, useState } from "react"
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Search } from "lucide-react";

function Navbar() {
    const [profileIsOpen, setProfileIsOpen] = useState(false);
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const isLoggedIn = !!user;
    const navigate = useNavigate()

    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileIsOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileIsOpen]);

    return (
        <div className="sticky top-0 w-full z-50 items-center h-16 -mb-18 pt-0.5">
            <div className="flex justify-between md:px-20 px-5 mt-2 mb-2 z-10">
                <div className="flex gap-2 items-center justify-center">
                    <img src="/logo.png" className="size-10  rounded-full shadow-xs"></img>
                    <NavLink to={"/"} className="font-bold text-2xl md:text-3xl text-shadow-xs">shotlist</NavLink>
                </div>
                <div className="-mr-35 items-center flex justify-center pr-38 z-10">
                    <div className="border rounded-full md:flex p-1 gap-2 items-center pr-2 hidden shadow-sm w-80">
                        <div className="border rounded-full p-2">
                            <Search size={16} />
                        </div>
                        <input type="text" placeholder="Search for anything..." className="text-[14px] focus:outline-0 w-60 text-shadow-xs" />
                    </div>
                </div>
                <div className="md:flex gap-5 font-light items-center text-[14px] hidden">
                    <NavLink to={"/browse"} className="text-shadow-xs">Browse</NavLink>
                    {
                        isLoggedIn ? <img src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.avatarSeed}`} className="size-9 shadow-xs rounded-full" onClick={() => setProfileIsOpen(!profileIsOpen)}></img>
                            : <NavLink to={"/signup"} className="shadow-2xl">Login/Signup</NavLink>
                    }
                </div>
                <div className="flex gap-5 items-center md:hidden z-10">
                    <img src="/search.png" className="size-7" onClick={() => setSearchIsOpen(!searchIsOpen)}></img>
                    {
                        isLoggedIn ? <img src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.avatarSeed}`} className="size-8 rounded-full" onClick={() => setProfileIsOpen(!profileIsOpen)}></img>
                            : <NavLink to={"/signup"} className="shadow-2xl text-sm z-10">Login/Signup</NavLink>
                    }
                </div>

                <div className={`fixed bg-[#202020] right-9 md:right-22 mt-13 text-[14px] rounded-b-md rounded-tl-md ${profileIsOpen ? `opacity-100 scale-100` : `opacity-0 pointer-events-none scale-95`} z-10 transition-all ease-in-out duration-400`} ref={dropdownRef}>
                    <div className="fixed bg-[#202020] w-4 h-4 right-1 md:right-1 -mt-2 rotate-45 border-l border-t border-[#505050]"></div>
                    <p onClick={() => navigate(`/profile/${user.username}`)} className="border-t border-l border-r border-[#505050] px-8 text-center p-2 rounded-tl-md hover:underline underline-offset-5">Profile</p>
                    <p className="border px-8 p-2 border-[#505050] text-center hover:underline underline-offset-5">Settings</p>
                    <p className="border-b border-l border-r px-8 p-2 border-[#505050] rounded-b-md hover:underline underline-offset-5" onClick={() => {logout(); setProfileIsOpen(false)}}>Sign Out</p>
                </div>

                <div className={`mt-12 -ml-5 flex w-full justify-center ${searchIsOpen ? `absolute` : `hidden`} md:hidden`}>
                    <span className="flex justify-between gap-2 p-2 bg-linear-to-r from-[#6d6d6da4] to-[#585858a3] rounded-full shadow-md ">
                        <input type="text" placeholder="Search for anything..." className="border text-white rounded-full pl-2 text-[14px] font-light focus:outline-none focus:ring-0"></input>
                        <button className="border rounded-full p-2 text-[14px] font-light">Search</button>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Navbar