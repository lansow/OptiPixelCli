import path from "path";

export function getExtension(filePath) {
  return path.extname(filePath).replace(".", "").toLowerCase();
}
