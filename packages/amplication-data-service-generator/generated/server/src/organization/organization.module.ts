import { Module } from "@nestjs/common";
import { OrganizationModuleBase } from "./base/organization.module.base";
import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";
import { OrganizationResolver } from "./organization.resolver";

@Module({
  imports: [OrganizationModuleBase],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationResolver],
  exports: [OrganizationService],
})
export class OrganizationModule {}
