import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { HealthServiceBase } from "./base/health.service.base";

@Injectable()
export class HealthService extends HealthServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
