import { Module } from "@nestjs/common";
import { Auth0Service } from "./auth0.service";

@Module({
  providers: [Auth0Service],
  exports: [Auth0Service],
})
export class IdpModule {}
