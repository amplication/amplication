import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SchemaImportService } from "./schemaImport.service";
import { Multer } from "multer";
import { Express } from "express";

@Controller("file")
export class SchemaImportController {
  constructor(private readonly schemaImportService: SchemaImportService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return this.schemaImportService.saveFile(file);
  }
}
