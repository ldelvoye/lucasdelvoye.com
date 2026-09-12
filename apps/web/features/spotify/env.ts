export class NotConfigured extends Error {}

export type SpotifyEnv = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  apiOrigin: string;
  accountsOrigin: string;
};

export type BucketEnv = {
  bucket: string;
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

const API_ORIGIN = "https://api.spotify.com";
const ACCOUNTS_ORIGIN = "https://accounts.spotify.com";

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new NotConfigured(`${name} is not set`);
  }
  if (value === "") {
    throw new NotConfigured(`${name} is empty`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  if (value === undefined) {
    return fallback;
  }
  if (value === "") {
    return fallback;
  }
  return value;
}

export function spotifyEnv(): SpotifyEnv {
  const clientId = required("SPOTIFY_CLIENT_ID");
  const clientSecret = required("SPOTIFY_CLIENT_SECRET");
  const refreshToken = required("SPOTIFY_REFRESH_TOKEN");
  const apiOrigin = optional("SPOTIFY_API_ORIGIN", API_ORIGIN);
  const accountsOrigin = optional("SPOTIFY_ACCOUNTS_ORIGIN", ACCOUNTS_ORIGIN);
  return { clientId, clientSecret, refreshToken, apiOrigin, accountsOrigin };
}

export function bucketEnv(): BucketEnv | null {
  const bucket = process.env.SPOTIFY_HISTORY_BUCKET;
  if (bucket === undefined) {
    return null;
  }
  if (bucket === "") {
    return null;
  }
  const endpoint = required("SPOTIFY_HISTORY_ENDPOINT");
  const region = required("SPOTIFY_HISTORY_REGION");
  const accessKeyId = required("SPOTIFY_HISTORY_ACCESS_KEY_ID");
  const secretAccessKey = required("SPOTIFY_HISTORY_SECRET_ACCESS_KEY");
  return { bucket, endpoint, region, accessKeyId, secretAccessKey };
}
