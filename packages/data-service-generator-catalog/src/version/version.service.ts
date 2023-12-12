import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { VersionServiceBase } from "./base/version.service.base";

@Injectable()
export class VersionService extends VersionServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
