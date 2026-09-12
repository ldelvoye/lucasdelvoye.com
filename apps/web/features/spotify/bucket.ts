import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { bucketEnv } from "./env";
import type { Play } from "./model";

const KEY = "spotify/plays.json";

type Client = { s3: S3Client; bucket: string };

let client: Client | null | undefined = undefined;

function connect(): Client | null {
  if (client !== undefined) {
    return client;
  }
  const env = bucketEnv();
  if (env === null) {
    client = null;
    return null;
  }
  const s3 = new S3Client({
    region: env.region,
    endpoint: env.endpoint,
    credentials: { accessKeyId: env.accessKeyId, secretAccessKey: env.secretAccessKey },
  });
  client = { s3, bucket: env.bucket };
  return client;
}

export function persistent(): boolean {
  const connected = connect();
  return connected !== null;
}

export async function loadPlays(): Promise<Play[]> {
  const connected = connect();
  if (connected === null) {
    return [];
  }
  try {
    const command = new GetObjectCommand({ Bucket: connected.bucket, Key: KEY });
    const result = await connected.s3.send(command);
    if (result.Body === undefined) {
      return [];
    }
    const text = await result.Body.transformToString();
    const parsed = JSON.parse(text) as Play[];
    return parsed;
  } catch (error) {
    if (isMissing(error)) {
      return [];
    }
    throw error;
  }
}

function isMissing(error: unknown): boolean {
  if (typeof error !== "object") {
    return false;
  }
  if (error === null) {
    return false;
  }
  const named = error as { name?: string };
  return named.name === "NoSuchKey";
}

export async function savePlays(plays: Play[]): Promise<void> {
  const connected = connect();
  if (connected === null) {
    return;
  }
  const body = JSON.stringify(plays);
  const command = new PutObjectCommand({
    Bucket: connected.bucket,
    Key: KEY,
    Body: body,
    ContentType: "application/json",
  });
  await connected.s3.send(command);
}
