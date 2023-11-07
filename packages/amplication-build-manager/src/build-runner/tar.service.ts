import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { promises as fsPromises } from "fs";
import { join, dirname } from "path";
import * as tar from "tar-stream";

@Injectable()
export class TarService {
  constructor(private readonly logger: AmplicationLogger) {}

  async isPathExists(path: string): Promise<boolean> {
    try {
      await fsPromises.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async packDir(pack, source, relativePath = ""): Promise<void> {
    try {
      const files = await fsPromises.readdir(source, { withFileTypes: true });
      for (const dirent of files) {
        if (dirent.name.startsWith(".")) {
          continue;
        }
        const filePath = join(source, dirent.name);
        const relFilePath = join(relativePath, dirent.name);
        const stat = await fsPromises.stat(filePath);
        if (stat.isFile()) {
          pack.entry(
            { name: relFilePath },
            await fsPromises.readFile(filePath)
          );
        } else if (stat.isDirectory()) {
          await this.packDir(pack, filePath, relFilePath);
        }
      }
    } catch (error) {
      this.logger.error(`Error packing directory ${source}`, error);
      throw new Error(`Error packing directory ${source}`);
    }
  }

  async tar(source, destination): Promise<void> {
    const pack = tar.pack();
    const outputFile = fs.createWriteStream(destination);

    try {
      pack.pipe(outputFile);
      await this.packDir(pack, source);
      pack.finalize();
      await new Promise((resolve, reject) => {
        outputFile.on("finish", resolve);
        outputFile.on("error", reject);
      });
    } catch (error) {
      this.logger.error(`Error creating tarball ${destination}`, error);
      throw new Error(`Error creating tarball ${destination}`);
    }
  }

  async extract(source, destination): Promise<void> {
    const extract = tar.extract();
    const inputFile = fs.createReadStream(source);

    try {
      inputFile.pipe(extract);

      await new Promise((resolve, reject) => {
        extract.on("entry", async (header, stream, next) => {
          const outputPath = join(destination, header.name);
          const outputDir = dirname(outputPath);

          if (!(await this.isPathExists(outputDir))) {
            await fsPromises.mkdir(outputDir, { recursive: true });
          }

          const outputFile = fs.createWriteStream(outputPath);
          stream.pipe(outputFile);
          outputFile.on("finish", next);
        });

        extract.on("finish", resolve);
        extract.on("error", reject);
        inputFile.on("error", reject);
      });
    } catch (error) {
      this.logger.error(`Error extracting tarball ${source}`, error);
      throw new Error(`Error extracting tarball ${source}`);
    }
  }
}
