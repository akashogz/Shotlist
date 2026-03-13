import React, { useEffect, useRef, useState } from 'react'

function Hero({ slides, loading }) {
    const [currentBG, setCurrentBG] = useState(0);
    
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

    return (
        <div></div>
    );

}

export default Hero