import { forwardRef, Module } from "@nestjs/common";
import { PrismaService, PrismaModule } from "../../prisma";
import { ResourceModule } from "../resource/resource.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { GitResolver } from "./git.resolver";
import { GitProviderService } from "./git.provider.service";
import { GitAuthController } from "./git-auth.controller";
@Module({
  imports: [PermissionsModule, forwardRef(() => ResourceModule), PrismaModule],
  controllers: [GitAuthController],
  providers: [GitProviderService, GitResolver, PrismaService],
})
export class GitProviderModule {}
