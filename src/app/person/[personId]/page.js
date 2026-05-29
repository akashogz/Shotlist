import Navbar from "@/components/layout/Navbar";
import PersonClient from "./PersonClient";

async function getPerson(personId) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movie/person/${personId}`,
        {
            next: { revalidate: 86400 },
        }
    );

    if (!res.ok) return null;

    return res.json();
}

export async function generateMetadata({ params }) {
    const { personId } = await params;

    const person = await getPerson(personId);

    if (!person) {
        return {
            title: "Person Not Found | Shotlist",
        };
    }

    const image = person.profile_path
        ? `https://image.tmdb.org/t/p/w780${person.profile_path}`
        : "https://shotlist.uk/og-image.png";

    const department =
        person.known_for_department === "Acting"
            ? "Actor"
            : person.known_for_department === "Directing"
                ? "Director"
                : person.known_for_department;

    return {
        title: `${person.name} | Shotlist`,

        description:
            person.biography?.slice(0, 160) ||
            `Discover movies, career timeline and filmography of ${person.name}.`,

        keywords: [
            person.name,
            department,
            "filmography",
            "movies",
            "actor",
            "director",
            "Shotlist",
        ],

        alternates: {
            canonical: `https://shotlist.uk/person/${personId}`,
        },

        openGraph: {
            title: `${person.name} | Shotlist`,
            description:
                person.biography?.slice(0, 160) ||
                `Discover movies and filmography of ${person.name}.`,
            url: `https://shotlist.uk/person/${personId}`,
            siteName: "Shotlist",
            images: [
                {
                    url: image,
                    width: 780,
                    height: 1170,
                    alt: person.name,
                },
            ],
            type: "profile",
        },

        twitter: {
            card: "summary_large_image",
            title: `${person.name} | Shotlist`,
            description:
                person.biography?.slice(0, 160) ||
                `Discover movies and filmography of ${person.name}.`,
            images: [image],
        },
    };
}

export default async function Page({ params }) {
    const { personId } = await params;

    const person = await getPerson(personId);

    return (
        <>
            <Navbar />
            <PersonClient
                initialPerson={person}
                personId={personId}
            />
        </>
    );
}