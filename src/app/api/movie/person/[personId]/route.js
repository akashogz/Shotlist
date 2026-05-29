import { NextResponse } from "next/server";
import { tmdbFetch, getCachedOrFetch } from "@/lib/tmdb";

export async function GET(req, { params }) {
  try {
    const { personId } = await params;
    const key = `person:details:${personId}`;

    const person = await getCachedOrFetch(
      key,
      async () =>
        tmdbFetch(`/person/${personId}`, {
          append_to_response: "combined_credits,images,external_ids",
        }),
      604800 // 7 days
    );

    return NextResponse.json(person);
  } catch (error) {
    console.error("Error fetching person details:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to fetch person details" },
      { status: 500 }
    );
  }
}
