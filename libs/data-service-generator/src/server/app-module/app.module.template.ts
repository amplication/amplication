import { Module, Scope } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MorganInterceptor } from "nest-morgan";
CUSTOM_IMPORTS;

declare const MODULES: any;
declare const CUSTOM_IMPORTS: any;

@Module({
  controllers: [],
  imports: MODULES,
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: MorganInterceptor("combined"),
    },
  ],
})
export class AppModule {}
