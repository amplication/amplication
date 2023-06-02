import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SchemaImportService } from "./schemaImport.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from "multer";
import { Express } from "express";
import { UserEntity } from "../../decorators/user.decorator";
import { User } from "../../models";

@Controller("file")
export class SchemaImportController {
  constructor(private readonly schemaImportService: SchemaImportService) {}

  @Post("upload-schema")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UserEntity() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body("resourceId") resourceId: string
  ): Promise<string> {
    return this.schemaImportService.saveFile(file, resourceId);
  }
}
