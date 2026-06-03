import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export async function optimizeImage(file, config) {
  const sourcePath = file.path;

  const beforeSize = file.size;

  const parsed = path.parse(sourcePath);

  const outputExt =
    config.format === "original" ? file.extension : config.format;

  const outputPath = path.join(
    parsed.dir,
    `${parsed.name}.optimized.${outputExt}`,
  );

  let pipeline = sharp(sourcePath);

  if (config.resize) {
    pipeline = pipeline.resize({
      width: config.resize,
      withoutEnlargement: true,
    });
  }

  switch (config.format) {
    case "webp":
      pipeline = pipeline.webp({
        quality: config.quality,
      });
      break;

    case "avif":
      pipeline = pipeline.avif({
        quality: config.quality,
      });
      break;

    default:
      pipeline = pipeline.jpeg({
        quality: config.quality,
      });
  }

  await pipeline.toFile(outputPath);

  const outputStat = await fs.stat(outputPath);

  return {
    input: sourcePath,
    output: outputPath,
    beforeSize,
    afterSize: outputStat.size,
  };
}
