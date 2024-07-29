import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PackageFileServiceBase } from "./base/packageFile.service.base";

@Injectable()
export class PackageFileService extends PackageFileServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
