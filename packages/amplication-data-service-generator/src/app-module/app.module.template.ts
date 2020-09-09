import { Module } from "@nestjs/common";
import { AccessControlModule, RolesBuilder } from "nest-access-control";
import { MorganModule } from "nest-morgan";
// @ts-ignore
import { AppController } from "./app.controller";

declare var MODULES: any;

@Module({
  controllers: [AppController],
  imports: MODULES,
  providers: [],
})
export class AppModule {}
