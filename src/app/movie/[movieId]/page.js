import Navbar from "@/components/layout/Navbar";
import MovieClient from "./MovieClient";

async function getMovie(movieId) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movie/${movieId}`,
        {
            next: { revalidate: 86400 },
        }
    );

    return res.json();
}

export async function generateMetadata({ params }) {
    const { movieId } = await params;

    const movie = await getMovie(movieId);

    return {
        title: `${movie.title} (${movie.release_date?.slice(0, 4)}) | Shotlist`,
        description: movie.overview,
        openGraph: {
            title: movie.title,
            description: movie.overview,
            images: [
                `https://image.tmdb.org/t/p/w780${movie.poster_path}`,
            ],
        },
    };
}

export default async function Page({ params }) {
    const { movieId } = await params;

    const movie = await getMovie(movieId);

    return (
        <>
            <Navbar />
            <MovieClient
                initialMovie={movie}
                movieId={movieId}
            />
        </>

    );
}