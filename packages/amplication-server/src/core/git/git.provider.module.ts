import { forwardRef, Module } from "@nestjs/common";
import { PrismaService, PrismaModule } from "../../prisma";
import { ResourceModule } from "../resource/resource.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { GitResolver } from "./git.resolver";
import { GitProviderService } from "./git.provider.service";
@Module({
  imports: [PermissionsModule, forwardRef(() => ResourceModule), PrismaModule],
  providers: [GitProviderService, GitResolver, PrismaService],
})
export class GitProviderModule {}
