import { Module } from "@nestjs/common";

declare class CONTROLLER {}
declare class GRPC_CONTROLLER {}
declare class PROVIDERS_ARRAY {}
declare class MODULE_BASE {}
declare class SERVICE {}

@Module({
  imports: [MODULE_BASE],
  controllers: [CONTROLLER, GRPC_CONTROLLER],
  providers: PROVIDERS_ARRAY,
  exports: [SERVICE],
})
export class MODULE {}
