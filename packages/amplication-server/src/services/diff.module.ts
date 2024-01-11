import { DiffService } from "./diff.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [DiffService],
  exports: [DiffService],
})
export class DiffModule {}
