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
