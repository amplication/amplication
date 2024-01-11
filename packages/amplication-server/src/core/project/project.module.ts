import { PrismaModule } from "../../prisma/prisma.module";
import { BillingModule } from "../billing/billing.module";
import { BlockModule } from "../block/block.module";
import { BuildModule } from "../build/build.module";
import { EntityModule } from "../entity/entity.module";
import { GitProviderModule } from "../git/git.provider.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceModule } from "../resource/resource.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { ProjectResolver } from "./project.resolver";
import { ProjectService } from "./project.service";
import { Module } from "@nestjs/common";

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
