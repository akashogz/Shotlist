import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/layout/AuthProvider";
import { GoogleAnalytics } from "@next/third-parties/google";import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Shotlist",
  description:
    "Discover movies from around the world, engage with a passionate community, share reviews and ratings, and build your personal movie catalog.",
  icons: {
    icon: "/favicon/favicon.ico",
  },
  keywords: [
    "movies",
    "movie reviews",
    "movie ratings",
    "watchlist",
    "cinema",
    "films",
    "movie database",
  ],

  openGraph: {
    title: "Shotlist",
    description:
      "Discover movies from around the world, engage with a passionate community, share reviews and ratings, and build your personal movie catalog.",
    url: "https://shotlist.uk",
    siteName: "Shotlist",
    images: [
      {
        url: "https://shotlist.uk/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Shotlist",
    description:
      "Discover movies from around the world, engage with a passionate community, share reviews and ratings, and build your personal movie catalog.",
    images: ["https://shotlist.uk/og-image.png"],
  },

  alternates: {
    canonical: "https://shotlist.uk",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`dots-bg ${inter.className}`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: "#333", color: "#fff" },
          }}
        />
        <AuthProvider>{children}</AuthProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
