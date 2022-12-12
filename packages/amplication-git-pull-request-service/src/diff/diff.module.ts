import { Module } from "@nestjs/common";
import { DiffService } from "./diff.service";
import { BuildPathFactory } from "./build-path-factory";

@Module({
  providers: [DiffService, BuildPathFactory],
  exports: [DiffService],
})
export class DiffModule {}
