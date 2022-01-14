import { builders as b, namedTypes } from "ast-types";
import { print } from "recast";
import { Module } from "../types";
import { relativeImportPath } from "./module";
import { join } from "path";

export class IndexFileBuilder {
  private readonly exportsDecelerations: namedTypes.ExportAllDeclaration[] = [];
  private readonly indexFilePath: string = "";

  constructor(private readonly targetFolder: string) {
    this.indexFilePath = join(this.targetFolder, "index.ts");
  }
  addFile(filePath: string): void {
    const exportLine = this.createExportLine(filePath);
    this.exportsDecelerations.push(exportLine);
    return;
  }
  addFolder(folderPath: string): void {
    return;
  } //TODO implement dtos folder in entity

  build(): Module {
    const file = b.file(b.program(this.exportsDecelerations));
    return {
      path: this.indexFilePath,
      code: print(file).code,
    };
  }
  private createExportLine(filePath: string): namedTypes.ExportAllDeclaration {
    const relativePath = relativeImportPath(this.indexFilePath, filePath);
    return b.exportAllDeclaration(b.stringLiteral(relativePath), null);
  }
}

export * from "./ast";
