import ytdl from "@distube/ytdl-core";

/**
 * Check whether a string is a valid YouTube URL.
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }

  return ytdl.validateURL(url);
}

/**
 * Extract the YouTube video ID.
 */
export function getVideoId(url: string): string | null {
  if (!isValidYouTubeUrl(url)) {
    return null;
  }

  return ytdl.getURLVideoID(url);
}

/**
 * Fetch metadata for a YouTube video.
 */
export async function getVideoInfo(url: string) {
  if (!isValidYouTubeUrl(url)) {
    throw new Error("Invalid YouTube URL.");
  }

  const info = await ytdl.getInfo(url);

  return {
    id: info.videoDetails.videoId,
    title: info.videoDetails.title,
    description: info.videoDetails.description,
    author: info.videoDetails.author.name,
    lengthSeconds: Number(info.videoDetails.lengthSeconds),
    thumbnails: info.videoDetails.thumbnails,
    publishDate: info.videoDetails.publishDate,
    keywords: info.videoDetails.keywords ?? [],
    isLive: info.videoDetails.isLiveContent,
    channelId: info.videoDetails.channelId,
  };
}

/**
 * Validate that the video is supported for processing.
 */
export async function validateVideo(url: string) {
  const info = await getVideoInfo(url);

  if (info.isLive) {
    throw new Error(
      "Live streams are not supported."
    );
  }

  return info;
}
