import { Module } from "@nestjs/common";
import { EmptyModuleBase } from "./base/empty.module.base";
import { EmptyService } from "./empty.service";
import { EmptyController } from "./empty.controller";
import { EmptyResolver } from "./empty.resolver";

@Module({
  imports: [EmptyModuleBase],
  controllers: [EmptyController],
  providers: [EmptyService, EmptyResolver],
  exports: [EmptyService],
})
export class EmptyModule {}
