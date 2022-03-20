import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { HealthServiceBase } from "./base/health.service.base";

@Injectable()
export class HealthService extends HealthServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
