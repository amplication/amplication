import { Module } from "@nestjs/common";
// @ts-ignore: Cannot find module '../prisma/prisma.module' or its corresponding type declarations.
import { PrismaModule } from "../prisma/prisma.module";
import { $$ENTITY$$Controller } from "$$ENTITY_CONTROLLER_MODULE$$";
import { $$ENTITY$$Service } from "$$ENTITY_SERVICE_MODULE$$";

@Module({
  imports: [PrismaModule],
  controllers: [$$ENTITY$$Controller],
  providers: [$$ENTITY$$Service],
})
export class $$ENTITY$$Module {}
