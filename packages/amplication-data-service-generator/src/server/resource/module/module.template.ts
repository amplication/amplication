import { Module } from "@nestjs/common";

declare class CONTROLLER {}
declare class SERVICE {}
declare class RESOLVER {}
declare class MODULE_BASE {}

@Module({
  imports: [MODULE_BASE],
  controllers: [CONTROLLER],
  providers: [SERVICE, RESOLVER],
  exports: [SERVICE],
})
export class MODULE {}
