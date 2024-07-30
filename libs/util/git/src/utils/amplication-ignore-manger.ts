import { minimatch } from "minimatch";
import { ok } from "assert";

export class AmplicationIgnoreManger {
  static AmplicationIgnoreFileName = ".amplicationignore";
  amplicationIgnoreExpressions: string[] = [];
  hasBeenInitialized = false;

  async init(getFileFn: (fileName: string) => Promise<string | null>) {
    const amplicationIgnoreFile = await getFileFn(
      AmplicationIgnoreManger.AmplicationIgnoreFileName
    );
    if (amplicationIgnoreFile) {
      ok(typeof amplicationIgnoreFile === "string");

      this.amplicationIgnoreExpressions = this.parseAmplicationIgnoreFile(
        amplicationIgnoreFile
      );
    }
    this.hasBeenInitialized = true;
  }

  private parseAmplicationIgnoreFile(amplicationIgnoreFile: string): string[] {
    return amplicationIgnoreFile.split("\n");
  }

  isIgnored(filePath: string): boolean {
    if (!this.hasBeenInitialized) {
      throw new Error("AmplicationIgnoreManger has not been initialized");
    }
    const isIgnored = this.amplicationIgnoreExpressions.some(
      (globExpression) => {
        const isGlobExpressionMatch = minimatch(filePath, globExpression, {
          dot: true,
        });
        return isGlobExpressionMatch;
      }
    );
    return isIgnored;
  }
}
