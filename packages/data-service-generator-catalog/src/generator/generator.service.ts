import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GeneratorServiceBase } from "./base/generator.service.base";

@Injectable()
export class GeneratorService extends GeneratorServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
