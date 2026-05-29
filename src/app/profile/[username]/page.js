import Navbar from "@/components/layout/Navbar";
import ProfileClient from "./ProfileClient";

async function getProfile(username) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile/${username}`,
        {
            next: { revalidate: 3600 },
        }
    );

    if (!res.ok) {
        return null;
    }

    return res.json();
}

export async function generateMetadata({ params }) {
    const { username } = await params;

    const user = await getProfile(username);

    if (!user) {
        return {
            title: "Profile Not Found | Shotlist",
        };
    }

    const avatar = `https://api.dicebear.com/9.x/glass/svg?seed=${user.avatarSeed}`;

    return {
        title: `${user.name || user.username} (@${user.username}) | Shotlist`,
        description: `${user.stats?.reviews || 0} reviews • ${user.stats?.watched || 0} watched movies`,

        openGraph: {
            title: `${user.name || user.username}`,
            description: `${user.stats?.reviews || 0} reviews • ${user.stats?.watched || 0} watched movies`,
            images: [avatar],
        },

        twitter: {
            card: "summary",
            title: `${user.name || user.username}`,
            description: `${user.stats?.reviews || 0} reviews • ${user.stats?.watched || 0} watched movies`,
            images: [avatar],
        },
    };
}

export default async function Page({ params }) {
    const { username } = await params;

    const profile = await getProfile(username);

    return (
        <>
            <Navbar />
            <ProfileClient
                initialProfile={profile}
                username={username}
            />
        </>
    );
}