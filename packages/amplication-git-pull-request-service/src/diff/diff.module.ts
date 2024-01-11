import { BuildPathFactory } from "./build-path-factory";
import { DiffService } from "./diff.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [DiffService, BuildPathFactory],
  exports: [DiffService],
})
export class DiffModule {}
