type RGBA = { r: number; g: number; b: number; a: number };

export function isColorValid(color: string) {
  const node = new Option();
  node.style.color = color;
  return (
    !!node.style.color &&
    !/(unset|initial|inherit|currentcolor|transparent)/i.test(color)
  );
}

function luminance({ r, g, b }: RGBA): number {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
}

function cssColorToRgba(color: string): RGBA {
  const canvas = new OffscreenCanvas(1, 1);
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas not supported");

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);

  const data = ctx.getImageData(0, 0, 1, 1).data;
  return {
    r: data[0] / 255,
    g: data[1] / 255,
    b: data[2] / 255,
    a: data[3] / 255,
  };
}

export function contrastScore(color1: string, color2: string) {
  if (!isColorValid(color1) || !isColorValid(color2)) return null;

  const rgba1 = cssColorToRgba(color1);
  const rgba2 = cssColorToRgba(color2);

  const lum1 = luminance(rgba1);
  const lum2 = luminance(rgba2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}
