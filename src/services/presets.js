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
