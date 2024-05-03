import { Module } from "@nestjs/common";
import { DiffService } from "./diff.service";

@Module({
  providers: [DiffService],
  exports: [DiffService],
})
export class DiffModule {}
