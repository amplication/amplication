import { Module } from "@nestjs/common";
import { PrismaModule } from "../../templates/prisma/prisma.module";
import { $$ENTITY$$Controller } from "$$ENTITY_CONTROLLER_MODULE$$";
import { $$ENTITY$$Service } from "resource/templates/controller/node_modules/$$ENTITY_SERVICE_MODULE$$";

@Module({
  imports: [PrismaModule],
  controllers: [$$ENTITY$$Controller],
  providers: [$$ENTITY$$Service],
})
export class $$ENTITY$$Module {}
