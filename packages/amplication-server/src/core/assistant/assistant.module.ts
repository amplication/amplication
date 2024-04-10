import { Module } from "@nestjs/common";
import { AssistantService } from "./assistant.service";
import { AssistantResolver } from "./assistant.resolver";
import { PermissionsModule } from "../permissions/permissions.module";
import { EntityModule } from "../entity/entity.module";
import { ResourceModule } from "../resource/resource.module";
import { ModuleModule } from "../module/module.module";

@Module({
  imports: [PermissionsModule, EntityModule, ResourceModule, ModuleModule],
  providers: [AssistantService, AssistantResolver],
  exports: [AssistantService, AssistantResolver],
})
export class AssistantModule {}
