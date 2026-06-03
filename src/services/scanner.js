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
