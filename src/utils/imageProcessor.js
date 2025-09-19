export async function resizeImage(buffer, width = 800) {
  if (!buffer) return null;
  const sharp = (await import("sharp")).default;
  return sharp(buffer).resize({ width }).toBuffer();
}
