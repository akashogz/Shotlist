import SearchClient from "./SearchClient";

export async function generateMetadata({ params }) {
  const { searchQuery } = await params;

  const query = decodeURIComponent(searchQuery);

  return {
    title: `Search: ${query} | Shotlist`,
    description: `Search results for ${query} on Shotlist. Discover movies, actors, directors, and more.`,
    alternates: {
      canonical: `https://shotlist.uk/search/${searchQuery}`,
    },
    openGraph: {
      title: `Search: ${query} | Shotlist`,
      description: `Search results for ${query} on Shotlist.`,
      url: `https://shotlist.uk/search/${searchQuery}`,
      siteName: "Shotlist",
      images: [
        {
          url: "https://shotlist.uk/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Search: ${query} | Shotlist`,
      description: `Search results for ${query} on Shotlist.`,
      images: ["https://shotlist.uk/og-image.png"],
    },
  };
}

export default function Page({ params }) {
  return <SearchClient searchQuery={params.searchQuery} />;
}