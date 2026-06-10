import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Collection } from "../../../../lib/models";

export async function POST(req) {
    const auth = await requireAuth();
    if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

    try {
        const owner = auth.user._id;
        if (!owner) return NextResponse.json({ message: "no User ID given" }, { status: 400 });

        const { title, description, movies, tags, visibility, isRanked } = await req.json();
        if (!title || !movies?.length) return NextResponse.json({ message: "Missing required fields" }, { status: 400 });

        await connectDB();

        let slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");;
        let candidate = slug;
        let i = 1;

        while (await Collection.exists({ owner, slug: candidate })) {
            candidate = `${slug}-${i}`;
            i++;
        }

        slug = candidate;

        const collection = await Collection.create({
            title,
            description,
            owner,
            movies,
            isRanked,
            tags,
            visibility,
            slug
        })

        return NextResponse.json({ message: "Collection created successfully", collection }, { status: 201 });
    } catch (error) {
        console.error("Error creating collection:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}