import { use, useState } from "react"

function Navbar() {
    const [profileIsOpen, setProfileIsOpen] = useState(false);
    const [searchIsOpen, setSearchIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className="fixed w-full z-50 bg-linear-to-b from-[#464e8241] to-[#24242400] items-center">
            <div className="flex justify-between md:px-20 px-5 mt-2 mb-2 z-10">
                <div className="flex gap-2 items-center justify-center">
                    <img src="/logo.png" className="size-10 object-fill rounded-full shadow-2xl"></img>
                    <p className="font-bold text-2xl md:text-3xl shadow-2xl">shotlist</p>
                </div>
                <div className="fixed w-full items-center flex justify-center pr-38">
                    <div className="border rounded-full md:flex p-1 gap-2 items-center pr-2 hidden shadow-sm w-80">
                        <div className="border rounded-full p-1">
                            <img src="/search.png" className="size-6"></img>
                        </div>
                        <input type="text" placeholder="Search for anything..." className="font-light text-[14px] focus:outline-0 w-60" />
                    </div>
                </div>
                <div className="md:flex gap-5 font-light items-center text-[14px] hidden">
                    <p className=" shadow-2xl">Browse</p>
                    {
                        isLoggedIn ?  <img src="/user.png" className="size-9 shadow-2xl" onClick={() => setProfileIsOpen(!profileIsOpen)}></img>
                        : <p className=" shadow-2xl">Login/Signup</p>
                    }
                </div>
                <div className="flex gap-5 items-center md:hidden">
                    <img src="/search.png" className="size-7" onClick={() => setSearchIsOpen(!searchIsOpen)}></img>
                    <img src="/user.png" className="size-8" onClick={() => setProfileIsOpen(!profileIsOpen)}></img>
                </div>

                <div className={`fixed bg-[#202020] right-6 md:right-21 mt-13 text-[14px] rounded-b-md rounded-tl-md ${profileIsOpen ? `opacity-100` : `opacity-0`} z-10 transition-opacity ease-in-out duration-400`}>
                    <div className="fixed bg-[#202020] w-4 h-4 right-7 md:right-22 -mt-2 rotate-45 border-l border-t border-[#505050]"></div>
                    <p className="border-t border-l border-r border-[#505050] px-8 text-center p-2 rounded-tl-md hover:underline underline-offset-5">Profile</p>
                    <p className="border px-8 p-2 border-[#505050] text-center hover:underline underline-offset-5">Settings</p>
                    <p className="border-b border-l border-r px-8 p-2 border-[#505050] rounded-b-md hover:underline underline-offset-5">Sign Out</p>
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