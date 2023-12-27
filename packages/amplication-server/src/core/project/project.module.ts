import { PrismaModule } from "../../prisma/prisma.module";
import { Module } from "@nestjs/common";
import { BillingModule } from "../billing/billing.module";
import { BlockModule } from "../block/block.module";
import { BuildModule } from "../build/build.module";
import { EntityModule } from "../entity/entity.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceModule } from "../resource/resource.module";
import { ProjectResolver } from "./project.resolver";
import { ProjectService } from "./project.service";
import { GitProviderModule } from "../git/git.provider.module";
import { SubscriptionModule } from "../subscription/subscription.module";

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    ResourceModule,
    BlockModule,
    EntityModule,
    BuildModule,
    BillingModule,
    GitProviderModule,
    SubscriptionModule,
  ],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectResolver, ProjectService],
})
export class ProjectModule {}
