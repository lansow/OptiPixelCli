

/* ===== ./test.js ===== */



/* ===== ./src/services/scanner.js ===== */

import fg from "fast-glob";
import fs from "fs/promises";
import path from "path";

import { IMAGE_EXTENSIONS } from "../utils/imageTypes.js";
import { getExtension } from "../utils/pathHelpers.js";

export async function scanImages(targetPath) {
  const targetStat = await fs.stat(targetPath);

  let imageFiles = [];
  let foldersScanned = 0;

  // Single File
  if (targetStat.isFile()) {
    const ext = getExtension(targetPath);

    if (!IMAGE_EXTENSIONS.includes(ext)) {
      throw new Error(`Unsupported file type: .${ext}`);
    }

    imageFiles = [path.resolve(targetPath)];
  }

  // Directory
  else if (targetStat.isDirectory()) {
    const files = await fg(`${targetPath}/**/*`, {
      onlyFiles: true,
      absolute: true,
    });

    imageFiles = files.filter((file) => {
      const ext = getExtension(file);

      if (!IMAGE_EXTENSIONS.includes(ext)) {
        return false;
      }

      if (file.includes(".optimized.")) {
        return false;
      }

      return true;
    });

    const folders = await fg(`${targetPath}/**`, {
      onlyDirectories: true,
    });

    foldersScanned = folders.length;
  } else {
    throw new Error("Invalid path");
  }

  const stats = {
    totalFiles: 0,
    totalSize: 0,
    foldersScanned,
    types: {},
    files: [],
  };

  for (const file of imageFiles) {
    const fileStat = await fs.stat(file);

    const ext = getExtension(file);

    stats.totalFiles += 1;
    stats.totalSize += fileStat.size;

    stats.types[ext] ??= 0;
    stats.types[ext] += 1;

    stats.files.push({
      path: file,
      size: fileStat.size,
      extension: ext,
    });
  }

  return stats;
}


/* ===== ./src/services/promptWizard.js ===== */

import { select, input, confirm } from "@inquirer/prompts";

import { PRESETS } from "./presets.js";

export async function promptWizard() {
  const preset = await select({
    message: "Choose optimization preset",
    choices: [
      {
        name: "Web Recommended",
        value: "web",
      },
      {
        name: "Maximum Compression",
        value: "compress",
      },
      {
        name: "High Quality",
        value: "quality",
      },
      {
        name: "Custom",
        value: "custom",
      },
    ],
  });

  if (preset !== "custom") {
    return PRESETS[preset];
  }

  const format = await select({
    message: "Output format",
    choices: [
      { name: "WebP", value: "webp" },
      { name: "AVIF", value: "avif" },
      { name: "Keep Original", value: "original" },
    ],
  });

  const quality = Number(
    await input({
      message: "Quality (1-100)",
      default: "80",
    }),
  );

  const metadata = await confirm({
    message: "Keep metadata?",
    default: false,
  });

  const resize = await confirm({
    message: "Resize images?",
    default: false,
  });

  let maxWidth = null;

  if (resize) {
    maxWidth = Number(
      await input({
        message: "Max width",
        default: "1920",
      }),
    );
  }

  return {
    name: "Custom",
    format,
    quality,
    metadata,
    resize: maxWidth,
  };
}


/* ===== ./src/services/reporter.js ===== */

export function printPresetSummary(config) {
  console.log();
  console.log("Selected Configuration");
  console.log();

  console.log(`Format     : ${config.format}`);
  console.log(`Quality    : ${config.quality}`);
  console.log(`Metadata   : ${config.metadata}`);
  console.log(`Resize     : ${config.resize ?? "No"}`);

  console.log();
}


/* ===== ./src/services/presets.js ===== */

export const PRESETS = {
  web: {
    name: "Web Recommended",
    format: "webp",
    quality: 80,
    metadata: false,
    resize: null,
  },

  compress: {
    name: "Maximum Compression",
    format: "avif",
    quality: 65,
    metadata: false,
    resize: null,
  },

  quality: {
    name: "High Quality",
    format: "webp",
    quality: 92,
    metadata: true,
    resize: null,
  },
};


/* ===== ./src/services/optimizer.js ===== */

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


/* ===== ./src/services/progressBar.js ===== */

export function renderProgress(current, total) {
  const width = 20;

  const percent = Math.floor((current / total) * 100);

  const filled = Math.floor((percent / 100) * width);

  const empty = width - filled;

  const bar = "■".repeat(filled) + "□".repeat(empty);

  process.stdout.write("\x1Bc");

  console.log(`[${bar}] ${percent}%`);
  console.log();
  console.log(`${current} / ${total}`);
}


/* ===== ./src/commands/optimize.js ===== */

import chalk from "chalk";
import ora from "ora";

import { scanImages } from "../services/scanner.js";
import { formatBytes } from "../utils/fileSize.js";
import { promptWizard } from "../services/promptWizard.js";
import { printPresetSummary } from "../services/reporter.js";
import { optimizeImage } from "../services/optimizer.js";
import { renderProgress } from "../services/progressBar.js";

export async function optimizeCommand(inputPath) {
  const spinner = ora("Scanning files...").start();

  try {
    const scanResult = await scanImages(inputPath);

    spinner.stop();

    console.log();
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log();

    console.log(chalk.green(`Found ${scanResult.totalFiles} image files`));

    console.log();

    Object.entries(scanResult.types).forEach(([type, count]) => {
      console.log(`${type.padEnd(5)} : ${count}`);
    });

    console.log();

    console.log(`Folders Scanned : ${scanResult.foldersScanned}`);

    console.log(`Total Size      : ${formatBytes(scanResult.totalSize)}`);

    console.log();
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log();

    const selectedPreset = await promptWizard();

    printPresetSummary(selectedPreset);

    const optimizedFiles = [];

    const total = scanResult.files.length;

    let current = 0;

    for (const file of scanResult.files) {
      const result = await optimizeImage(file, selectedPreset);

      optimizedFiles.push(result);

      current++;

      renderProgress(current, total);
    }

    let totalBefore = 0;
    let totalAfter = 0;

    for (const file of optimizedFiles) {
      totalBefore += file.beforeSize;
      totalAfter += file.afterSize;
    }

    const savedBytes = totalBefore - totalAfter;

    const savedPercent =
      totalBefore === 0 ? 0 : ((savedBytes / totalBefore) * 100).toFixed(1);

    console.log();

    console.log(chalk.green(`✔ ${optimizedFiles.length} images optimized`));

    console.log();

    console.log(`Before Size : ${formatBytes(totalBefore)}`);

    console.log(`After Size  : ${formatBytes(totalAfter)}`);

    console.log(`Saved Space : ${formatBytes(savedBytes)}`);

    console.log(`Reduction   : ${savedPercent}%`);

    console.log();
  } catch (error) {
    spinner.fail(error.message);
  }
}


/* ===== ./src/utils/pathHelpers.js ===== */

import path from "path";

export function getExtension(filePath) {
  return path.extname(filePath).replace(".", "").toLowerCase();
}


/* ===== ./src/utils/imageTypes.js ===== */

export const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
  "tiff",
  "bmp",
];


/* ===== ./src/utils/fileSize.js ===== */

export function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}


/* ===== ./src/index.js ===== */

#!/usr/bin/env node

import { Command } from "commander";
import { optimizeCommand } from "./commands/optimize.js";

const program = new Command();

program
  .name("img-opt")
  .description(
    "A powerful CLI tool for optimizing, converting, and compressing images for modern web applications.",
  )
  .version("1.0.0");

program.argument("<path>", "Image file or directory path");

program.action(optimizeCommand);

program.parse();
