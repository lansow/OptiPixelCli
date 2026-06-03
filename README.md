# OptiPixel CLI

A powerful and developer-friendly CLI tool for optimizing, compressing, resizing, and converting images for modern web applications.

Built with performance and simplicity in mind, OptiPixel helps developers reduce image sizes, improve website loading speed, and automate image optimization workflows directly from the terminal.

---

## Features

### Image Scanning

- Scan a single image file
- Scan entire directories recursively
- Automatically detect supported image formats
- Ignore previously optimized files

### Optimization

- Convert images to WebP
- Convert images to AVIF
- Compress images with configurable quality
- Resize images with maximum width constraints
- Generate optimized copies without modifying originals

### Smart Presets

#### Web Recommended

Optimized for websites and web applications.

```text
Format: WebP
Quality: 80
Metadata: Removed
Resize: Disabled
```

#### Maximum Compression

Designed for maximum file size reduction.

```text
Format: AVIF
Quality: 65
Metadata: Removed
Resize: Disabled
```

#### High Quality

Designed for preserving image quality.

```text
Format: WebP
Quality: 92
Metadata: Preserved
Resize: Disabled
```

#### Custom

Configure every option manually.

- Output format
- Quality
- Metadata
- Resize width

---

## Supported Formats

Input formats:

- JPG
- JPEG
- PNG
- WebP
- AVIF
- GIF
- TIFF
- BMP

Output formats:

- WebP
- AVIF
- Original Format

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/optipixel-cli.git

cd optipixel-cli
```

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev <path>
```

Example:

```bash
npm run dev ./images
```

Or:

```bash
npm run dev ./images/photo.jpg
```

---

## Usage

### Optimize a Directory

```bash
npm run dev ./images
```

Example output:

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

### Optimize a Single File

```bash
npm run dev ./photo.jpg
```

---

## Interactive Configuration

After scanning, OptiPixel launches an interactive setup wizard.

```text
Choose optimization preset

❯ Web Recommended
  Maximum Compression
  High Quality
  Custom
```

Selecting Custom allows you to configure:

```text
Output Format
Quality
Keep Metadata
Resize Images
Maximum Width
```

---

## Progress Tracking

Real-time optimization progress:

```text
[■■■■■■■■■■□□□□□□□□] 42%

104 / 247
```

---

## Output Files

Optimized images are created next to the original image.

Example:

```text
photo.jpg
photo.optimized.webp
```

Original files are never modified.

---

## Optimization Summary

After completion, OptiPixel displays a detailed report.

```text
✔ 247 images optimized

Before Size : 1.8 GB
After Size  : 620 MB

Saved Space : 1.18 GB
Reduction   : 65.4%
```

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

## Technologies Used

### Sharp

High-performance image processing library.

Used for:

- Compression
- Conversion
- Resizing
- Metadata handling

### Commander

CLI argument parsing and command management.

### Fast Glob

Fast recursive file system scanning.

Used to:

- Scan directories
- Locate image files
- Detect nested folders

### Inquirer Prompts

Interactive terminal user interface.

Used for:

- Preset selection
- Custom configuration
- User confirmations

### Ora

Terminal spinners and loading indicators.

### Chalk

Terminal colors and formatting.

---

## Current Workflow

```text
User Input
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

## Roadmap

### Planned Features

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

---

## Author

Lansow

---

## License

MIT License
