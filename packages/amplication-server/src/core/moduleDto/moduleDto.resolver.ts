import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { User } from "../../models";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { CreateModuleDtoArgs } from "./dto/CreateModuleDtoArgs";
import { CreateModuleDtoPropertyArgs } from "./dto/CreateModuleDtoPropertyArgs";
import { DeleteModuleDtoArgs } from "./dto/DeleteModuleDtoArgs";
import { FindManyModuleDtoArgs } from "./dto/FindManyModuleDtoArgs";
import { ModuleDto } from "./dto/ModuleDto";
import { ModuleDtoProperty } from "./dto/ModuleDtoProperty";
import { UpdateModuleDtoArgs } from "./dto/UpdateModuleDtoArgs";
import { UpdateModuleDtoPropertyArgs } from "./dto/UpdateModuleDtoPropertyArgs";
import { ModuleDtoService } from "./moduleDto.service";

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

  @Mutation(() => ModuleDtoProperty, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.BlockId,
    "data.moduleDto.connect.id"
  )
  async createModuleDtoProperty(
    @UserEntity() user: User,
    @Args() args: CreateModuleDtoPropertyArgs
  ): Promise<ModuleDtoProperty> {
    return this.service.createDtoProperty(args, user);
  }

  @Mutation(() => ModuleDtoProperty, {
    nullable: false,
  })
  @AuthorizeContext(AuthorizableOriginParameter.BlockId, "where.moduleDto.id")
  async updateModuleDtoProperty(
    @UserEntity() user: User,
    @Args() args: UpdateModuleDtoPropertyArgs
  ): Promise<ModuleDtoProperty> {
    return this.service.updateDtoProperty(args, user);
  }
}
