import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TemplateServiceBase } from "./base/template.service.base";

@Injectable()
export class TemplateService extends TemplateServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
