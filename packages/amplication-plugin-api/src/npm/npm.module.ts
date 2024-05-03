import { Module } from "@nestjs/common";
import { NpmService } from "./npm.service";

@Module({
  providers: [NpmService],
  exports: [NpmService],
})
export class NpmModule {}
