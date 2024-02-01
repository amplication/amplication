import { Module } from "@nestjs/common";

declare const MODULES: any;

@Module({
  controllers: [],
  imports: MODULES,
  providers: [],
})
export class AppModule {}
