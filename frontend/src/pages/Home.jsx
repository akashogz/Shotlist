import { Suspense, useEffect, useLayoutEffect, useState, useRef, lazy, use } from "react";

import { Link } from "react-router-dom";
import api from "../lib/api/api";
import { ExternalLink, Play } from "lucide-react";

const Tiles = lazy(() => import("../components/ui/Tiles"));
const GenreCards = lazy(() => import("../components/features/GenreCards"));
const CommunityCard = lazy(() => import("../components/features/CommunityCard"));

function Home() {
  const [slides, setSlides] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [currentBG, setCurrentBG] = useState(0);
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [alltime, setAllTime] = useState([]);
  const [rowsLoading, setRowsLoading] = useState(true);
  const [topReviews, setTopReviews] = useState([]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function nextSlide() {
    setCurrentBG((prev) => (slides.length ? (prev + 1) % slides.length : 0));
  }

  function prevSlide() {
    setCurrentBG((prev) =>
      slides.length ? (prev - 1 + slides.length) % slides.length : 0
    );
  }

  useEffect(() => {
    if (heroLoading || slides.length === 0) return;
    const timer = setTimeout(nextSlide, 5000);
    return () => clearTimeout(timer);
  }, [currentBG, heroLoading, slides]);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    touchEndX.current = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchEndX.current - touchStartX.current > 50) prevSlide();
  }
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [popularData, trendingData, allTimeData, reviewData] = await Promise.all([
          api.get('/movie/popular'),
          api.get('/movie/trending'),
          api.get('/movie/top_rated'),
          api.get('/user/fetchTopReviews')
        ]);

        setSlides(popularData.data.slice(0, 5));
        setPopular(popularData.data);
        setTrending(trendingData.data);
        setAllTime(allTimeData.data);
        setTopReviews(reviewData.data.topReviews);

      } catch (error) {
        console.error("Failed to sync data:", error);
      } finally {
        setHeroLoading(false);
        setRowsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <div
        className="relative w-full h-dvh z-1 "
        aria-busy={heroLoading}
        onTouchStart={!heroLoading ? handleTouchStart : undefined}
        onTouchMove={!heroLoading ? handleTouchMove : undefined}
        onTouchEnd={!heroLoading ? handleTouchEnd : undefined}
      >
        {heroLoading && (
          <div className="absolute inset-0 animate-pulse bg-linear-to-b from-[#55555584] to-[#24242476]" />
        )}

        {!heroLoading && (
          <>
            {slides.map((slide, index) => (
              <img
                key={slide.id}
                src={
                  slide.backdrop_path
                    ? `https://image.tmdb.org/t/p/w1280${slide.backdrop_path}`
                    : "/fallback.jpg"
                }
                alt={slide.title || "Movie backdrop"}
                loading="eager"
                fetchPriority="high"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${index === currentBG
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                  }`}
              />
            ))}

            <div className="absolute inset-0 bg-linear-to-b from-[#464e8263] to-[#242424]" />

            <div className="relative z-10 h-full flex flex-col justify-end px-5 md:px-20 gap-6 text-white bottom-20 md:bottom-25">
              <h1 className="text-4xl md:text-6xl font-black drop-shadow-md">
                {slides[currentBG]?.title}
              </h1>

              <p className="text-md md:text-lg drop-shadow-md line-clamp-4">
                {slides[currentBG]?.overview}
              </p>

              <div className="flex gap-2">
                <Link to={`movie/${slides[currentBG]?.id}?trailer=open`} className="border rounded-full p-3 px-4 flex items-center gap-2 text-[14px] font-bold cursor-pointer">
                  Play Trailer
                  <Play size={14} fill="white" />
                </Link>

                <Link to={`movie/${slides[currentBG]?.id}`} className="border rounded-full p-3 px-4 flex items-center gap-2 text-[14px] bg-[#464E82] border-[#464E82] font-bold cursor-pointer">
                  Visit Page
                  <ExternalLink size={14}  />
                </Link>
              </div>

              <div className="w-full flex items-center justify-center gap-4 px-20">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBG(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`w-2 h-2 rounded-full -mb-10 transition-opacity duration-700 ${index === currentBG
                        ? "bg-white opacity-100"
                        : "bg-white/50 opacity-50"
                      }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Suspense fallback={null}>
        <div className="px-5 md:px-20 flex flex-col gap-8 mt-5">
          <section>
            <p className="text-2xl md:text-3xl font-bold mb-4">Trending This Week</p>
            <Tiles movies={trending} title="Trending This Week" loading={rowsLoading} />
          </section>

          <section>
            <p className="text-2xl md:text-3xl font-bold mb-4">Popular Now</p>
            <Tiles movies={popular} title="Popular Now" loading={rowsLoading} />
          </section>

          <section>
            <p className="text-2xl md:text-3xl font-bold mb-4">Best of All Time</p>
            <Tiles movies={alltime} title="Best of All Time" loading={rowsLoading} />
          </section>

          <section>
            <p className="text-2xl md:text-3xl font-bold mb-4">Search by Genre</p>
            <GenreCards loading={rowsLoading} />
          </section>

          <section>
            <p className="text-2xl md:text-3xl font-bold mb-4">From the community…</p>
            <CommunityCard loading={rowsLoading} topReviews={topReviews} />
          </section>
        </div>
      </Suspense>
    </>
  );
}

export default Home;
