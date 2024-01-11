import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceModule } from "../resource/resource.module";
import { UserModule } from "../user/user.module";
import { ServiceTopicsResolver } from "./serviceTopics.resolver";
import { ServiceTopicsService } from "./serviceTopics.service";
import { forwardRef, Module } from "@nestjs/common";

@Module({
  imports: [
    UserModule,
    BlockModule,
    PermissionsModule,
    forwardRef(() => ResourceModule),
  ],
  providers: [ServiceTopicsService, ServiceTopicsResolver],
  exports: [ServiceTopicsService, ServiceTopicsResolver],
})
export class ServiceTopicsModule {}
