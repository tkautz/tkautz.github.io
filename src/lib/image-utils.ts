/**
 * Convert an image path to its WebP equivalent.
 * e.g., "/images/covers/foo.jpg" → "/images/covers/foo.webp"
 */
export function toWebP(src: string): string {
  return src.replace(/\.(jpe?g|png)$/i, ".webp");
}
