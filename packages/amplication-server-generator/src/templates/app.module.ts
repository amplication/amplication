import { Module } from "@nestjs/common";

declare var MODULES: any;

@Module({
  imports: MODULES,
})
export class AppModule {}
