import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PackageModelServiceBase } from "./base/packageModel.service.base";

@Injectable()
export class PackageModelService extends PackageModelServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
