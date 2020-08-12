import { Module } from "@nestjs/common";
// @ts-ignore
import { AppController } from "./app.controller";

declare var MODULES: any;

@Module({
  controllers: [AppController],
  imports: MODULES,
})
export class AppModule {}
