import { Module } from "@nestjs/common";
import { CategoryModuleBase } from "./base/category.module.base";
import { CategoryService } from "./category.service";
import { CategoryResolver } from "./category.resolver";

@Module({
  imports: [CategoryModuleBase],
  providers: [CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
