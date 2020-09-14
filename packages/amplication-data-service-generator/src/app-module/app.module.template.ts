import { Module } from "@nestjs/common";
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
