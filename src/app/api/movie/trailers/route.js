import { NextResponse } from "next/server";

const CHANNEL_ID = "UCi8e0iOVk1fEOogdfu4YgfA";

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${apiKey}`
    );

    const channelData = await channelRes.json();

    const uploadsPlaylistId =
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
    );

    const playlistData = await playlistRes.json();

    const videoIds = playlistData.items
      .map((item) => item.contentDetails.videoId)
      .join(",");

    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`
    );

    const videosData = await videosRes.json();

    const durationMap = {};

    videosData.items.forEach((video) => {
      durationMap[video.id] = video.contentDetails.duration;
    });

    const isShort = (duration) => {
      const match = duration.match(
        /PT(?:(\d+)M)?(?:(\d+)S)?/
      );

      const minutes = Number(match?.[1] || 0);
      const seconds = Number(match?.[2] || 0);

      return minutes * 60 + seconds <= 60;
    };

    const videos = playlistData.items
      .filter((item) => {
        const duration =
          durationMap[item.contentDetails.videoId];

        return !isShort(duration) && (item.snippet.title.toLowerCase().includes("trailer") || item.snippet.title.toLowerCase().includes("teaser"));
      })
      .slice(0, 10)
      .map((item) => ({
        title: item.snippet.title,
        videoId: item.contentDetails.videoId,
        published: item.snippet.publishedAt,
        thumbnail:
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.medium?.url,
        link: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
      }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}