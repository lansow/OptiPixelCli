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
