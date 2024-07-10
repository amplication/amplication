import { Module } from "@nestjs/common";
import { AssistantService } from "./assistant.service";
import { AssistantResolver } from "./assistant.resolver";
import { PermissionsModule } from "../permissions/permissions.module";
import { EntityModule } from "../entity/entity.module";
import { ResourceModule } from "../resource/resource.module";
import { ModuleModule } from "../module/module.module";
import { ProjectModule } from "../project/project.module";
import { GraphqlSubscriptionPubSubKafkaService } from "./graphqlSubscriptionPubSubKafka.service";
import { PluginCatalogModule } from "../pluginCatalog/pluginCatalog.module";
import { PluginInstallationModule } from "../pluginInstallation/pluginInstallation.module";
import { ModuleActionModule } from "../moduleAction/moduleAction.module";
import { ModuleDtoModule } from "../moduleDto/moduleDto.module";
import { BillingModule } from "../billing/billing.module";
import { AssistantFunctionsService } from "./assistantFunctions.service";
import { JsonSchemaValidationModule } from "../../services/jsonSchemaValidation.module";
import { SegmentAnalyticsModule } from "../../services/segmentAnalytics/segmentAnalytics.module";

@Module({
  imports: [
    PermissionsModule,
    EntityModule,
    ResourceModule,
    ModuleModule,
    ProjectModule,
    PluginCatalogModule,
    PluginInstallationModule,
    ModuleActionModule,
    ModuleDtoModule,
    BillingModule,
    JsonSchemaValidationModule,
    SegmentAnalyticsModule,
  ],
  providers: [
    AssistantService,
    AssistantFunctionsService,
    AssistantResolver,
    GraphqlSubscriptionPubSubKafkaService,
  ],
  exports: [AssistantService, AssistantResolver],
})
export class AssistantModule {}
