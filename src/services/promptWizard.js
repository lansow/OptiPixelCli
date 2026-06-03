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
