import { Module } from "@nestjs/common";
// @ts-ignore
import { AppController } from "./app.controller";

declare const MODULES: any;

@Module({
  controllers: [AppController],
  imports: MODULES,
  providers: [],
})
export class AppModule {}
