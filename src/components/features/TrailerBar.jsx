"use client";

import { ChevronLeft, ChevronRight, Play, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";

const TrailerBar = () => {
    const [videos, setVideos] = useState([]);
    const [openTrailers, setOpenTrailers] = useState(false);

    useEffect(() => {
        fetch(
            "/api/movie/trailers"
        )
            .then((res) => res.json())
            .then(setVideos)
            .catch(console.error);
    }, []);

    return (
        <>
            <div className={`hidden lg:flex flex-col w-65 bg-[#303030] border-l border-[#262626] h-screen fixed ${openTrailers ? `right-0` : `-right-55`} top-0 pt-24 p-6 gap-5 z-10 rounded-l-lg overflow-y-auto overflow-x-visible no-scrollbar transition-all duration-300 pointer-events-auto`} onMouseEnter={() => setOpenTrailers(true)} onMouseLeave={() => setOpenTrailers(false)}>
                <div className={`fixed ${openTrailers ? `right-60` : `right-5`} top-1/2 -translate-y-1/2 z-10 w-8 h-12 bg-[#303030] rounded-l-lg flex items-center justify-center cursor-pointer transition-all duration-300`}>
                    <ChevronLeft className={`transition-transform duration-300 ${openTrailers ? "rotate-180" : ""}`} color="gray" />
                </div>
                <h1 className={`font-bold text-xl w-full text-center  justify-center items-center mb-5`}>Latest Trailers</h1>
                <div className="flex flex-col gap-10">
                    {videos.map((video) => (
                        <a
                            key={video.videoId}
                            href={video.link}
                            target="_blank"
                            rel="noreferrer"
                            className={`flex items-center flex-col gap-1`}
                        >
                            <div className="relative w-55 group">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-55 rounded-lg aspect-video object-cover group-hover:brightness-80 transition-all duration-200"
                                />

                                <PlayCircle
                                    className="absolute inset-0 m-auto w-10 h-10 text-white drop-shadow-lg" strokeWidth={1}
                                />
                            </div>

                            <h3 className="text-sm text-center">{video.title}</h3>
                        </a>))}
                </div>
            </div>
        </>
    );
};

export default TrailerBar;