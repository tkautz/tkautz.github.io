#!/usr/bin/env node
/**
 * Image optimization script
 * Resizes and compresses images to appropriate dimensions for their display context,
 * and generates WebP versions for modern browsers.
 */
import sharp from "sharp";
import { readdir, stat, mkdir } from "fs/promises";
import { join, extname, basename } from "path";

const PUBLIC = "public/images";

// Display sizes (CSS px) × 2 for retina
const COVER_WIDTH = 160; // displayed at 80px
const COVER_HEIGHT = 224; // displayed at 112px
const JOURNAL_WIDTH = 128; // displayed at 64px
const JOURNAL_HEIGHT = 176; // displayed at 88px
const LOGO_SIZE = 64; // displayed at 16-32px
const HEADSHOT_WIDTH = 512; // displayed at max 256px

const JPEG_QUALITY = 80;
const WEBP_QUALITY = 78;
const PNG_QUALITY = 80; // compression level for PNG

async function processImage(inputPath, outputPath, opts) {
  const { width, height, format } = opts;
  let pipeline = sharp(inputPath);

  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: "cover",
      withoutEnlargement: true,
    });
  }

  if (format === "webp") {
    pipeline = pipeline.webp({ quality: WEBP_QUALITY, effort: 6 });
  } else if (format === "jpeg" || format === "jpg") {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (format === "png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, effort: 10 });
  }

  await pipeline.toFile(outputPath);
}

function changeExt(filePath, newExt) {
  const ext = extname(filePath);
  return filePath.slice(0, -ext.length) + newExt;
}

async function getFileSize(path) {
  const s = await stat(path);
  return s.size;
}

async function optimizeDirectory(dir, width, height, label) {
  let files;
  try {
    files = await readdir(dir);
  } catch {
    console.log(`  Skipping ${dir} (not found)`);
    return;
  }

  const imageFiles = files.filter((f) =>
    /\.(jpg|jpeg|png)$/i.test(f)
  );

  console.log(`\n${label}: ${imageFiles.length} images in ${dir}`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of imageFiles) {
    const inputPath = join(dir, file);
    const ext = extname(file).toLowerCase();
    const format = ext === ".png" ? "png" : "jpeg";

    const beforeSize = await getFileSize(inputPath);
    totalBefore += beforeSize;

    try {
      // Resize and compress original format
      const tempPath = inputPath + ".tmp";
      await processImage(inputPath, tempPath, { width, height, format });

      // Replace original
      const { rename } = await import("fs/promises");
      await rename(tempPath, inputPath);

      const afterSize = await getFileSize(inputPath);
      totalAfter += afterSize;

      // Generate WebP version
      const webpPath = changeExt(inputPath, ".webp");
      await processImage(inputPath, webpPath, {
        width,
        height,
        format: "webp",
      });
      const webpSize = await getFileSize(webpPath);

      const savings = ((1 - afterSize / beforeSize) * 100).toFixed(1);
      const webpSavings = ((1 - webpSize / beforeSize) * 100).toFixed(1);
      console.log(
        `  ${file}: ${(beforeSize / 1024).toFixed(0)}KB → ${(afterSize / 1024).toFixed(0)}KB (${savings}% smaller) | WebP: ${(webpSize / 1024).toFixed(0)}KB (${webpSavings}% smaller)`
      );
    } catch (err) {
      totalAfter += beforeSize;
      console.log(`  ${file}: SKIPPED (${err.message})`);
    }
  }

  const totalSavings = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(
    `  TOTAL: ${(totalBefore / 1024).toFixed(0)}KB → ${(totalAfter / 1024).toFixed(0)}KB (${totalSavings}% smaller)`
  );
}

async function optimizeHeadshot() {
  const inputPath = join(PUBLIC, "headshot-2.jpg");
  const beforeSize = await getFileSize(inputPath);

  console.log("\nHeadshot:");

  // Resize and compress JPEG (preserve original aspect ratio, only constrain width)
  const tempPath = inputPath + ".tmp";
  await processImage(inputPath, tempPath, {
    width: HEADSHOT_WIDTH,
    format: "jpeg",
  });
  const { rename } = await import("fs/promises");
  await rename(tempPath, inputPath);
  const afterSize = await getFileSize(inputPath);

  // Generate WebP
  const webpPath = changeExt(inputPath, ".webp");
  await processImage(inputPath, webpPath, {
    width: HEADSHOT_WIDTH,
    format: "webp",
  });
  const webpSize = await getFileSize(webpPath);

  console.log(
    `  headshot-2.jpg: ${(beforeSize / 1024).toFixed(0)}KB → ${(afterSize / 1024).toFixed(0)}KB | WebP: ${(webpSize / 1024).toFixed(0)}KB`
  );
}

async function optimizeLogos() {
  const dir = join(PUBLIC, "logos");
  let files;
  try {
    files = await readdir(dir);
  } catch {
    console.log("  Skipping logos (not found)");
    return;
  }

  const imageFiles = files.filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
  console.log(`\nLogos: ${imageFiles.length} images`);

  for (const file of imageFiles) {
    const inputPath = join(dir, file);
    const ext = extname(file).toLowerCase();
    const format = ext === ".png" ? "png" : "jpeg";
    const beforeSize = await getFileSize(inputPath);

    const tempPath = inputPath + ".tmp";
    await processImage(inputPath, tempPath, {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      format,
    });

    const { rename } = await import("fs/promises");
    await rename(tempPath, inputPath);
    const afterSize = await getFileSize(inputPath);

    // WebP version
    const webpPath = changeExt(inputPath, ".webp");
    await processImage(inputPath, webpPath, {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      format: "webp",
    });
    const webpSize = await getFileSize(webpPath);

    console.log(
      `  ${file}: ${(beforeSize / 1024).toFixed(0)}KB → ${(afterSize / 1024).toFixed(0)}KB | WebP: ${(webpSize / 1024).toFixed(0)}KB`
    );
  }
}

async function main() {
  console.log("=== Image Optimization ===\n");

  await optimizeHeadshot();
  await optimizeLogos();
  await optimizeDirectory(
    join(PUBLIC, "journals"),
    JOURNAL_WIDTH,
    JOURNAL_HEIGHT,
    "Journal covers"
  );
  await optimizeDirectory(
    join(PUBLIC, "covers"),
    COVER_WIDTH,
    COVER_HEIGHT,
    "Publication covers"
  );

  console.log("\n=== Done! ===");
}

main().catch(console.error);
