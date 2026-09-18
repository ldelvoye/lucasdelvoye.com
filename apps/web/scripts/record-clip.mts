import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { chromium } from "playwright";

const runCommand = promisify(execFile);

const SITE = "https://lucasdelvoye.com";
const WIDTH = 1280;
const HEIGHT = 720;
const SCALE = 2;
const JPEG_QUALITY = 95;
const INTRO_TIMEOUT_MS = 30_000;
const SETTLE_MS = 4_000;
const SKIP_MS = 120;
const READ_MS = 3_200;
const HOLDS_MS = [SKIP_MS, READ_MS, READ_MS];
const TAIL_MS = 800;
const OUT_WIDTH = 1920;
const OUT_HEIGHT = 1080;
const OUT_FPS = 30;
const LAST_FRAME_MS = 400;

const TARGET = fileURLToPath(new URL("../public/projects/lucasdelvoye-com.mp4", import.meta.url));

type Frame = { path: string; at: number };

function listing(frames: Frame[]): string {
  const lines: string[] = [];
  for (let index = 0; index < frames.length; index += 1) {
    const frame = frames[index];
    const next = frames[index + 1];
    let seconds = LAST_FRAME_MS / 1000;
    if (next !== undefined) {
      seconds = next.at - frame.at;
    }
    lines.push(`file '${frame.path}'`);
    lines.push(`duration ${seconds.toFixed(4)}`);
  }
  const final = frames[frames.length - 1];
  lines.push(`file '${final.path}'`);
  return lines.join("\n");
}

async function capture(directory: string): Promise<Frame[]> {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: SCALE,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  const frames: Frame[] = [];

  session.on("Page.screencastFrame", (event) => {
    const acknowledge = () => {
      session.send("Page.screencastFrameAck", { sessionId: event.sessionId }).catch(() => {});
    };
    const at = event.metadata.timestamp;
    if (at === undefined) {
      acknowledge();
      return;
    }
    const path = join(directory, `${String(frames.length).padStart(5, "0")}.jpg`);
    writeFileSync(path, Buffer.from(event.data, "base64"));
    frames.push({ path, at });
    acknowledge();
  });

  await page.goto(SITE, { waitUntil: "load" });
  await session.send("Page.startScreencast", {
    format: "jpeg",
    quality: JPEG_QUALITY,
    maxWidth: WIDTH * SCALE,
    maxHeight: HEIGHT * SCALE,
    everyNthFrame: 1,
  });

  await page.waitForSelector("[data-intro]", { state: "visible", timeout: INTRO_TIMEOUT_MS });
  await page.waitForSelector('[data-window][data-grow="true"]', { timeout: INTRO_TIMEOUT_MS });
  await page.waitForTimeout(SETTLE_MS);

  for (const hold of HOLDS_MS) {
    await page.keyboard.press("l");
    await page.waitForTimeout(hold);
  }
  await page.waitForTimeout(TAIL_MS);

  await session.send("Page.stopScreencast");
  await context.close();
  await browser.close();

  if (frames.length === 0) {
    throw new Error("the screencast produced no frames");
  }
  return frames;
}

async function encode(list: string, target: string): Promise<void> {
  const filter = `scale=${OUT_WIDTH}:${OUT_HEIGHT}:flags=lanczos,fps=${OUT_FPS}`;
  const args = [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    list,
    "-vf",
    filter,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "21",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    target,
  ];
  await runCommand("ffmpeg", args, { maxBuffer: 1024 * 1024 * 64 });
}

const directory = await mkdtemp(join(tmpdir(), "clip-"));
try {
  const frames = await capture(directory);
  const list = join(directory, "frames.txt");
  await writeFile(list, listing(frames));
  await mkdir(dirname(TARGET), { recursive: true });
  await encode(list, TARGET);
  console.log(`wrote ${TARGET} from ${frames.length} frames`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
