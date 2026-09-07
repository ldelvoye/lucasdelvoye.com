export type Pixels = { data: Uint8ClampedArray; width: number; height: number };

const EMPTY: Pixels = { data: new Uint8ClampedArray(0), width: 0, height: 0 };

export function pixelsFromImage(
  source: HTMLImageElement | HTMLCanvasElement,
  width: number,
  height: number,
): Pixels {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (context === null) {
    return EMPTY;
  }
  context.imageSmoothingEnabled = true;
  context.drawImage(source, 0, 0, width, height);
  const image = context.getImageData(0, 0, width, height);
  return { data: image.data, width, height };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.addEventListener("error", () => {
      reject(new Error(`could not load ${src}`));
    });
    image.src = src;
  });
}
