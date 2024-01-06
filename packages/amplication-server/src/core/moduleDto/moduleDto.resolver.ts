import { Parent, ResolveField, Resolver, Query, Args } from "@nestjs/graphql";
import { ModuleDtoService } from "./moduleDto.service";
import { FindManyModuleDtoArgs } from "./dto/FindManyModuleDtoArgs";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { ModuleDto } from "./dto/ModuleDto";
import { CreateModuleDtoArgs } from "./dto/CreateModuleDtoArgs";
import { UpdateModuleDtoArgs } from "./dto/UpdateModuleDtoArgs";
import { DeleteModuleDtoArgs } from "./dto/DeleteModuleDtoArgs";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";

@Resolver(() => ModuleDto)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ModuleDtoResolver extends BlockTypeResolver(
  ModuleDto,
  "moduleDtos",
  FindManyModuleDtoArgs,
  "createModuleDto",
  CreateModuleDtoArgs,
  "updateModuleDto",
  UpdateModuleDtoArgs,
  "deleteModuleDto",
  DeleteModuleDtoArgs
) {
  constructor(private readonly service: ModuleDtoService) {
    super();
  }

  @Query(() => [ModuleDto])
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.resource.id")
  @UseGuards(GqlAuthGuard)
  async availableDtosForResource(
    @Args() args: FindManyModuleDtoArgs
  ): Promise<ModuleDto[]> {
    return this.service.availableDtosForResource(args);
  }
}
