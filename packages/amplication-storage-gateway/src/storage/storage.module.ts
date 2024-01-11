import { PaginationModule } from "../pagination/pagination.module";
import { QueueModule } from "../queue/queue.module";
import { StorageController } from "./storage.controller";
import { StorageResolver } from "./storage.resolver";
import { StorageService } from "./storage.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [PaginationModule, QueueModule],
  controllers: [StorageController],
  providers: [StorageService, StorageResolver],
  exports: [StorageService],
})
export class StorageModule {}
