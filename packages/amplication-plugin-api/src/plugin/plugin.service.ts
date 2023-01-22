import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PluginServiceBase } from "./base/plugin.service.base";

@Injectable()
export class PluginService extends PluginServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
