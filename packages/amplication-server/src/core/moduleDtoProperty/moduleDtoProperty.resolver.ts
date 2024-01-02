import { Resolver } from "@nestjs/graphql";
import { ModuleDtoPropertyService } from "./moduleDtoProperty.service";
import { FindManyModuleDtoPropertyArgs } from "./dto/FindManyModuleDtoPropertyArgs";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { ModuleDtoProperty } from "./dto/ModuleDtoProperty";
import { CreateModuleDtoPropertyArgs } from "./dto/CreateModuleDtoPropertyArgs";
import { UpdateModuleDtoPropertyArgs } from "./dto/UpdateModuleDtoPropertyArgs";
import { DeleteModuleDtoPropertyArgs } from "./dto/DeleteModuleDtoPropertyArgs";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";

@Resolver(() => ModuleDtoProperty)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ModuleDtoPropertyResolver extends BlockTypeResolver(
  ModuleDtoProperty,
  "moduleDtoProperties",
  FindManyModuleDtoPropertyArgs,
  "createModuleDtoProperty",
  CreateModuleDtoPropertyArgs,
  "updateModuleDtoProperty",
  UpdateModuleDtoPropertyArgs,
  "deleteModuleDtoProperty",
  DeleteModuleDtoPropertyArgs
) {
  constructor(private readonly service: ModuleDtoPropertyService) {
    super();
  }
}
