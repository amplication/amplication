import path from "path";

export function getFileEncoding(filePath: string): BufferEncoding {
  const extension = path.extname(filePath);
  switch (extension) {
    case ".png":
    case ".ico":
    case ".jpg":
      return "base64";
    default:
      return "utf-8";
  }
}
