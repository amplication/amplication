import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { PluginVersionServiceBase } from "./base/pluginVersion.service.base";

@Injectable()
export class PluginVersionService extends PluginVersionServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
