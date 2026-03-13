import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Search } from "lucide-react";

function Navbar() {

    const [profileIsOpen, setProfileIsOpen] = useState(false);
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const isLoggedIn = !!user;

    const navigate = useNavigate();

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
        navigate(`/search/${searchQuery}`);
        setSearchQuery("");
    };

    return (

        <div className="fixed top-0 w-full h-16 z-40">

            <div className="flex justify-between md:px-20 px-5 items-center h-full">

                <div className="flex gap-2 items-center">
                    <img src="/logo.png" className="size-10 rounded-full shadow-xs" />
                    <NavLink to="/" className="font-bold text-2xl md:text-3xl">
                        shotlist
                    </NavLink>
                </div>

                <div className="hidden md:flex border rounded-full p-1 gap-2 items-center pr-2 shadow-sm w-80">

                    <div className="border rounded-full p-2">
                        <Search size={16} />
                    </div>

                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="text-sm focus:outline-none w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />

                </div>

                <div className="hidden md:flex gap-5 items-center text-sm">

                    <NavLink to="/browse">
                        Browse
                    </NavLink>

                    {isLoggedIn ? (

                        <img
                            src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.avatarSeed}`}
                            className="size-9 rounded-full cursor-pointer"
                            onClick={() => setProfileIsOpen(!profileIsOpen)}
                        />

                    ) : (

                        <NavLink to="/signup">
                            Login / Signup
                        </NavLink>

                    )}

                </div>


                <div className="flex md:hidden gap-4 items-center">

                    <img
                        src="/search.png"
                        className="size-7 cursor-pointer"
                        onClick={() => setSearchIsOpen(!searchIsOpen)}
                    />

                    {isLoggedIn ? (

                        <img
                            src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.avatarSeed}`}
                            className="size-8 rounded-full"
                            onClick={() => setProfileIsOpen(!profileIsOpen)}
                        />

                    ) : (

                        <NavLink to="/signup" className="text-sm">
                            Login
                        </NavLink>

                    )}

                </div>

            </div>

            <div
                ref={profileRef}
                className={`absolute right-5 md:right-20 top-16 bg-[#202020] rounded-md overflow-hidden transition-all duration-200 z-50 text-sm
                ${profileIsOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >

                <Link
                    to={`/profile/${user?.username}`}
                    className="block px-6 py-2 hover:bg-[#2a2a2a]"
                >
                    Profile
                </Link>

                <Link
                    to="/browse"
                    className="block md:hidden px-6 py-2 hover:bg-[#2a2a2a]"
                >
                    Browse
                </Link>

                <Link
                    to="/settings"
                    className="block px-6 py-2 hover:bg-[#2a2a2a]"
                >
                    Settings
                </Link>

                <button
                    className="block w-full text-left px-6 py-2 hover:bg-[#2a2a2a]"
                    onClick={() => {
                        logout();
                        setProfileIsOpen(false);
                    }}
                >
                    Sign Out
                </button>

            </div>

            <div
                ref={searchRef}
                className={`md:hidden absolute left-0 right-0 top-16 flex justify-center z-50
                ${searchIsOpen ? "flex" : "hidden"}`}
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
                        onClick={() => {
                            handleSearch();
                            setSearchIsOpen(false);
                        }}
                    >
                        Search
                    </button>

                </div>

            </div>

        </div>

    );
}

export default Navbar;