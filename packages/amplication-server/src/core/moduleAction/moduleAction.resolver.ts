import { Resolver } from "@nestjs/graphql";
import { ModuleActionService } from "./moduleAction.service";
import { FindManyModuleActionArgs } from "./dto/FindManyModuleActionArgs";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { ModuleAction } from "./dto/ModuleAction";
import { CreateModuleActionArgs } from "./dto/CreateModuleActionArgs";
import { UpdateModuleActionArgs } from "./dto/UpdateModuleActionArgs";
import { DeleteModuleActionArgs } from "./dto/DeleteModuleActionArgs";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";

@Resolver(() => ModuleAction)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ModuleActionResolver extends BlockTypeResolver(
  ModuleAction,
  "moduleActions",
  FindManyModuleActionArgs,
  "createModuleAction",
  CreateModuleActionArgs,
  "updateModuleAction",
  UpdateModuleActionArgs,
  "deleteModuleAction",
  DeleteModuleActionArgs
) {
  constructor(private readonly service: ModuleActionService) {
    super();
  }
}
