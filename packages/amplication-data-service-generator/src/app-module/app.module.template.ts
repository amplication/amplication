/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-empty-interface, @typescript-eslint/naming-convention */

import { Module } from "@nestjs/common";
// @ts-ignore
// eslint-disable-next-line
import { AppController } from "./app.controller";

declare const MODULES: any;

@Module({
  controllers: [AppController],
  imports: MODULES,
  providers: [],
})
export class AppModule {}
