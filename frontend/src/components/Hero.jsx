import React, { useEffect, useRef, useState } from 'react'

function Hero({ slides, loading }) {
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
        <div></div>
    );

}

export default Hero