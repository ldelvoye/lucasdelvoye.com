"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { loadImage, pixelsFromImage, type Pixels } from "./canvas";
import styles from "./PixelArt.module.css";

export function PixelArt({ pixels, label }: { pixels: Pixels | null; label: string }): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  let width: number;
  let height: number;
  if (pixels === null) {
    width = 0;
    height = 0;
  } else {
    width = pixels.width;
    height = pixels.height;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const context = canvas.getContext("2d");
    if (context === null) {
      return;
    }
    if (pixels === null) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const image = context.createImageData(pixels.width, pixels.height);
    image.data.set(pixels.data);
    context.putImageData(image, 0, 0);
  }, [pixels]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      className={styles.art}
    />
  );
}

function dimensionsFor(
  size: number,
  naturalWidth: number,
  naturalHeight: number,
): { width: number; height: number } {
  if (naturalWidth > naturalHeight) {
    const scaled = (size * naturalHeight) / naturalWidth;
    const rounded = Math.round(scaled);
    const height = Math.max(1, rounded);
    return { width: size, height };
  }
  const scaled = (size * naturalWidth) / naturalHeight;
  const rounded = Math.round(scaled);
  const width = Math.max(1, rounded);
  return { height: size, width };
}

export function PixelImage({
  src,
  size,
  label,
}: {
  src: string;
  size: number;
  label: string;
}): ReactElement {
  const [pixels, setPixels] = useState<Pixels | null>(null);

  useEffect(() => {
    let live = true;
    async function draw() {
      try {
        const image = await loadImage(src);
        if (!live) {
          return;
        }
        const dimensions = dimensionsFor(size, image.naturalWidth, image.naturalHeight);
        const nextPixels = pixelsFromImage(image, dimensions.width, dimensions.height);
        setPixels(nextPixels);
      } catch {
        if (!live) {
          return;
        }
        setPixels(null);
      }
    }
    draw();
    return () => {
      live = false;
    };
  }, [src, size]);

  return <PixelArt pixels={pixels} label={label} />;
}
