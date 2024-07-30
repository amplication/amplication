import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GenerationLogServiceBase } from "./base/generationLog.service.base";

@Injectable()
export class GenerationLogService extends GenerationLogServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
