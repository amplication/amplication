import { Module, Scope } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

declare const MODULES: any;

@Module({
  controllers: [],
  imports: MODULES,
  providers: [],
})
export class AppModule {}
