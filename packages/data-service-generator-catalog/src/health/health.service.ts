import { PrismaService } from "../prisma/prisma.service";
import { HealthServiceBase } from "./base/health.service.base";
import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService extends HealthServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
