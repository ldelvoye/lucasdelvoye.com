import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomBytes } from "node:crypto";

const PORT = 8917;
const HOST = "127.0.0.1";
const REDIRECT_URI = `http://${HOST}:${PORT}/callback`;
const SCOPE = "user-read-currently-playing user-read-recently-played user-top-read";
const AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

function requestPath(request: IncomingMessage): string {
  let path: string;
  if (request.url === undefined) {
    path = "/";
  } else {
    path = request.url;
  }
  return path;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    console.error(`${name} is not set`);
    process.exit(1);
  }
  if (value === "") {
    console.error(`${name} is empty`);
    process.exit(1);
  }
  return value;
}

const clientId = requiredEnv("SPOTIFY_CLIENT_ID");
const clientSecret = requiredEnv("SPOTIFY_CLIENT_SECRET");
const state = randomBytes(16).toString("hex");

function authorizeUrl(): string {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

async function exchangeCode(code: string): Promise<string> {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  });
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`token exchange failed: ${response.status} ${text}`);
  }
  const json = JSON.parse(text) as { refresh_token: string };
  return json.refresh_token;
}

async function handleCallback(url: URL, response: ServerResponse): Promise<void> {
  const returnedState = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (returnedState !== state) {
    response.writeHead(400, { "Content-Type": "text/plain" });
    response.end("state mismatch");
    console.error("state mismatch");
    process.exit(1);
  }
  if (code === null) {
    response.writeHead(400, { "Content-Type": "text/plain" });
    response.end("missing code");
    console.error("missing code in callback");
    process.exit(1);
  }
  const refreshToken = await exchangeCode(code);
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("done, back to the terminal");
  console.log(`SPOTIFY_REFRESH_TOKEN=${refreshToken}`);
  process.exit(0);
}

const server = createServer((request, response) => {
  const url = new URL(requestPath(request), REDIRECT_URI);
  if (request.method !== "GET") {
    response.writeHead(404);
    response.end();
    return;
  }
  if (url.pathname !== "/callback") {
    response.writeHead(404);
    response.end();
    return;
  }
  handleCallback(url, response).catch((error: unknown) => {
    response.writeHead(500, { "Content-Type": "text/plain" });
    response.end("token exchange failed");
    console.error(error);
    process.exit(1);
  });
});

server.listen(PORT, HOST, () => {
  console.log("open this url:");
  console.log(authorizeUrl());
});
