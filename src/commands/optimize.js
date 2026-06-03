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
