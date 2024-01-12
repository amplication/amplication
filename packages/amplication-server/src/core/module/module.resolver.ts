import { Resolver } from "@nestjs/graphql";
import { ModuleService } from "./module.service";
import { FindManyModuleArgs } from "./dto/FindManyModuleArgs";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { Module } from "./dto/Module";
import { CreateModuleArgs } from "./dto/CreateModuleArgs";
import { UpdateModuleArgs } from "./dto/UpdateModuleArgs";
import { DeleteModuleArgs } from "./dto/DeleteModuleArgs";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";

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
