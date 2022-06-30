import stream from "stream";
import crypto from "crypto";

/**
 * Creates a SHA1 hash according to provided stream
 * @param stream
 */
export function createHash(stream: stream.Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha1");
    hash.setEncoding("hex");

    stream.on("end", () => {
      hash.end();
      resolve(hash.read());
    });
    stream.on("error", reject);
    hash.on("error", reject);

    stream.pipe(hash);
  });
}
