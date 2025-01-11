import { Module } from "@nestjs/common";

declare class CONTROLLER {}
declare class PROVIDERS_ARRAY {}
declare class SERVICE {}

@Module({
  controllers: [CONTROLLER],
  providers: PROVIDERS_ARRAY,
  exports: [SERVICE],
})
export class MODULE {}
