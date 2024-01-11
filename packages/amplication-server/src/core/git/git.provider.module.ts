import { PrismaService, PrismaModule } from "../../prisma";
import { BillingModule } from "../billing/billing.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ProjectModule } from "../project/project.module";
import { ResourceModule } from "../resource/resource.module";
import { GitProviderService } from "./git.provider.service";
import { GitResolver } from "./git.resolver";
import { forwardRef, Module } from "@nestjs/common";
@Module({
  imports: [
    PermissionsModule,
    forwardRef(() => ResourceModule),
    PrismaModule,
    BillingModule,
    forwardRef(() => ProjectModule),
  ],
  providers: [GitProviderService, GitResolver, PrismaService],
  exports: [GitProviderService],
})
export class GitProviderModule {}
