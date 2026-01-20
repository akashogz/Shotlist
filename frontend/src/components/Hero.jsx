import React, { useEffect, useRef, useState } from 'react'

function Hero({ slides }) {
    const [currentBG, setCurrentBG] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    function nextSlide() {
        setCurrentBG(prev => {
            const newSlide =
                prev === slides.length - 1 ? 0 : prev + 1;
            return newSlide;
        });
    }

    function prevSlide() {
        setCurrentBG(prev => {
            const newSlide =
                prev === 0 ? slides.length - 1 : prev - 1;
            return newSlide;
        });
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            nextSlide();
        }, 5000);

        return () => clearTimeout(timer);
    }, [currentBG]);

    if (!slides || slides.length === 0) return null;

    function handleTouchStart(e) {
        touchStartX.current = e.touches[0].clientX;
    }

    function handleTouchMove(e) {
        touchEndX.current = e.touches[0].clientX;
    }

    function handleTouchEnd() {
        if (touchStartX.current - touchEndX.current > 50) {
            nextSlide();
        }

        if (touchEndX.current - touchStartX.current > 50) {
            prevSlide();
        }
    }

    return (
        <div className="relative w-full h-dvh z-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>

            {/* Background Image */}
            {
                slides.map((slide, index) => (
                    <img
                        key={index}
                        src={
                            slide.backdrop_path
                                ? `https://image.tmdb.org/t/p/w1280${slide.backdrop_path}`
                                : "/fallback.jpg"
                        }
                        alt={slide.title || "Movie backdrop"}
                        loading="lazy"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentBG ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                    />
                ))
            }

            {/* Optional Dark Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-[#464e8263] to-[#242424]">
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end px-5 md:px-20 gap-6 text-white bottom-20 md:bottom-25">
                <h1 className="text-4xl md:text-6xl font-black drop-shadow-md">
                    {`${slides[currentBG].title}`}
                </h1>
                <p className="text-md md:text-lg drop-shadow-md">
                    {`${slides[currentBG].overview}`}
                </p>
                <div className='flex gap-2'>
                    <button className='border rounded-full p-3 px-4 flex items-center gap-2 text-[14px] font-bold'>Play Trailer <img src='play.png' className='size-3'></img></button>
                    <button className='border rounded-full p-3 px-4 flex items-center gap-2 text-[14px] bg-[#464E82] border-[#464E82] font-bold'>Visit Page <img src='visit.png' className='size-3'></img></button>
                </div>
                <div className='w-full flex items-center justify-center gap-4 px-20'>
                    {
                        slides.map((value, index) => {
                            return <div key={index} className={`w-2 h-2 rounded-full ${index === currentBG ? `bg-white` : `bg-white/50`} -mb-10 transition-opacity duration-700 ${index === currentBG ? `opacity-100` : `opacity-50`}`} onClick={() => setCurrentBG(index)}></div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Hero