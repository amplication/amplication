import { NpmService } from "./npm.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [NpmService],
  exports: [NpmService],
})
export class NpmModule {}
