import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { CreateModuleArgs } from "./dto/CreateModuleArgs";
import { DeleteModuleArgs } from "./dto/DeleteModuleArgs";
import { FindManyModuleArgs } from "./dto/FindManyModuleArgs";
import { Module } from "./dto/Module";
import { UpdateModuleArgs } from "./dto/UpdateModuleArgs";
import { ModuleService } from "./module.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Resolver } from "@nestjs/graphql";

@Resolver(() => Module)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ModuleResolver extends BlockTypeResolver(
  Module,
  "modules",
  FindManyModuleArgs,
  "createModule",
  CreateModuleArgs,
  "updateModule",
  UpdateModuleArgs,
  "deleteModule",
  DeleteModuleArgs
) {
  constructor(private readonly service: ModuleService) {
    super();
  }
}
