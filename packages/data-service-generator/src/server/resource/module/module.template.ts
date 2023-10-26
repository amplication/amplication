import { Module } from "@nestjs/common";

declare class CONTROLLER {}
declare class CONTROLLER_GRPC {}
declare class PROVIDERS_ARRAY {}
declare class MODULE_BASE {}
declare class SERVICE {}

@Module({
  imports: [MODULE_BASE],
  controllers: [CONTROLLER, CONTROLLER_GRPC],
  providers: PROVIDERS_ARRAY,
  exports: [SERVICE],
})
export class MODULE {}
