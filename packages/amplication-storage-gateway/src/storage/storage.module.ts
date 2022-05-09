import { Module } from "@nestjs/common";
import { PaginationModule } from "../pagination/pagination.module";
import { StorageController } from "./storage.controller";
import { StorageResolver } from "./storage.resolver";
import { StorageService } from "./storage.service";

@Module({
  imports: [PaginationModule],
  controllers: [StorageController],
  providers: [StorageService, StorageResolver],
  exports: [StorageService],
})
export class StorageModule {}
