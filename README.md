# OptiPixel CLI

<p align="center">
  <img src="https://img.shields.io/npm/v/optipixel-cli" alt="npm version">
  <img src="https://img.shields.io/npm/dm/optipixel-cli" alt="npm downloads">
  <img src="https://img.shields.io/npm/l/optipixel-cli" alt="license">
  <img src="https://img.shields.io/node/v/optipixel-cli" alt="node version">
</p>

<p align="center">
  A powerful CLI tool for optimizing, compressing, resizing, and converting images for modern web applications.
</p>

<p align="center">
  NPM Package:
  https://www.npmjs.com/package/optipixel-cli
</p>

---

## Why OptiPixel?

Modern websites depend heavily on image performance.

Large image assets increase page load times, reduce Core Web Vitals scores, and negatively impact user experience.

OptiPixel helps developers optimize images directly from the terminal with a simple interactive workflow.

Perfect for:

- Frontend developers
- Next.js projects
- React applications
- Static websites
- Portfolio sites
- Blogs
- E-commerce platforms

---

## Features

### Smart Image Scanning

- Scan a single image file
- Scan entire directories recursively
- Detect supported image formats automatically
- Ignore already optimized files
- Count image types and folders
- Calculate total image size before optimization

### Optimization

- Convert images to WebP
- Convert images to AVIF
- Compress images with configurable quality settings
- Resize images while preserving aspect ratio
- Prevent unnecessary upscaling
- Keep original files untouched

### Interactive CLI Wizard

Built-in guided configuration:

- Preset selection
- Format selection
- Quality control
- Metadata handling
- Resize options

### Progress Tracking

Real-time terminal progress display:

```text
[■■■■■■■■■■□□□□□□□□] 42%

104 / 247
```

### Optimization Report

Detailed summary after processing:

```text
✔ 247 images optimized

Before Size : 1.8 GB
After Size  : 620 MB

Saved Space : 1.18 GB
Reduction   : 65.4%
```

---

## Smart Presets

### Web Recommended

Best choice for most websites.

```text
Format   : WebP
Quality  : 80
Metadata : Removed
Resize   : Disabled
```

### Maximum Compression

Prioritizes smallest possible file size.

```text
Format   : AVIF
Quality  : 65
Metadata : Removed
Resize   : Disabled
```

### High Quality

Prioritizes visual quality.

```text
Format   : WebP
Quality  : 92
Metadata : Preserved
Resize   : Disabled
```

### Custom

Manually configure:

- Output format
- Quality
- Metadata
- Resize width

---

## Supported Formats

### Input

- JPG
- JPEG
- PNG
- WebP
- AVIF
- GIF
- TIFF
- BMP

### Output

- WebP
- AVIF
- Original Format

---

# Installation

## Install Globally

Install once and use everywhere.

```bash
npm install -g optipixel-cli
```

Verify installation:

```bash
optipixel --version
```

---

## Use Directly With NPX

No installation required.

```bash
npx optipixel-cli ./images
```

Single file:

```bash
npx optipixel-cli ./photo.jpg
```

---

## Install Inside a Project

```bash
npm install optipixel-cli
```

Run using:

```bash
npx optipixel ./images
```

---

## Development Installation

Clone the repository:

```bash
git clone https://github.com/lansow/OptiPixelCli.git

cd OptiPixelCli
```

Install dependencies:

```bash
npm install
```

Run:

```bash
npm run dev ./images
```

Single file:

```bash
npm run dev ./photo.jpg
```

---

# Usage

## Optimize an Entire Directory

```bash
optipixel ./images
```

Example:

```bash
optipixel ./public/images
```

---

## Optimize a Single Image

```bash
optipixel ./photo.jpg
```

---

## Scan Results

Example:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━

Found 247 image files

jpg   : 152
png   : 95

Folders Scanned : 14
Total Size      : 1.8 GB

━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Interactive Configuration

After scanning files, OptiPixel launches the setup wizard.

```text
Choose optimization preset

❯ Web Recommended
  Maximum Compression
  High Quality
  Custom
```

Custom mode allows configuration of:

```text
Output Format
Quality
Keep Metadata
Resize Images
Maximum Width
```

---

## Output Files

Optimized files are generated next to the original file.

Example:

```text
images/

photo.jpg
photo.optimized.webp
```

Original files are never modified.

---

## Example Workflow

```text
User Path
    ↓
Scan Files
    ↓
Analyze Images
    ↓
Select Preset
    ↓
Configure Options
    ↓
Optimize Images
    ↓
Generate Report
```

---

## Technologies Used

### Sharp

High-performance image processing engine.

Used for:

- Compression
- Format conversion
- Resizing
- Metadata handling

Repository:

https://github.com/lovell/sharp

---

### Commander

CLI command parsing and management.

Repository:

https://github.com/tj/commander.js

---

### Fast Glob

Fast recursive filesystem scanning.

Repository:

https://github.com/mrmlnc/fast-glob

---

### Inquirer Prompts

Interactive terminal prompts.

Repository:

https://github.com/SBoudrias/Inquirer.js

---

### Ora

Terminal spinners and loading states.

Repository:

https://github.com/sindresorhus/ora

---

### Chalk

Terminal colors and formatting.

Repository:

https://github.com/chalk/chalk

---

## Project Structure

```text
src/
│
├── commands/
│   └── optimize.js
│
├── services/
│   ├── optimizer.js
│   ├── presets.js
│   ├── progressBar.js
│   ├── promptWizard.js
│   ├── reporter.js
│   └── scanner.js
│
├── utils/
│   ├── fileSize.js
│   ├── imageTypes.js
│   └── pathHelpers.js
│
└── index.js
```

---

## Roadmap

Planned future improvements:

- Output Directory Support
- Replace Original Files
- Backup Mode
- Parallel Processing
- Smart Compression Detection
- Skip Larger Output Files
- Configuration File Support
- Watch Mode
- Batch Profiles
- Plugin System
- CI/CD Integration
- SVG Optimization
- PNG Quantization

---

## Contributing

Contributions, issues, and feature requests are welcome.

Feel free to open an issue or submit a pull request.

Repository:

https://github.com/lansow/OptiPixelCli

---

## Author

**Lansow**

GitHub:

https://github.com/lansow

Sponsor:

https://github.com/sponsors/Lansow

---

<div align="center">
  
**[lansow](https://lansow.ir)**
  
</div>

---

## License

MIT License

Copyright (c) 2026 Lansow
