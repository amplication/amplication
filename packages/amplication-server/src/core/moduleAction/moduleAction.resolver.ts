import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { CreateModuleActionArgs } from "./dto/CreateModuleActionArgs";
import { DeleteModuleActionArgs } from "./dto/DeleteModuleActionArgs";
import { FindManyModuleActionArgs } from "./dto/FindManyModuleActionArgs";
import { ModuleAction } from "./dto/ModuleAction";
import { UpdateModuleActionArgs } from "./dto/UpdateModuleActionArgs";
import { ModuleActionService } from "./moduleAction.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Resolver } from "@nestjs/graphql";

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
