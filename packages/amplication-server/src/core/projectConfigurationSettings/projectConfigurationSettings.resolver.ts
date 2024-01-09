import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { User } from "../../models";
import { ProjectConfigurationSettings } from "./dto/ProjectConfigurationSettings";
import { UpdateProjectConfigurationSettingsArgs } from "./dto/UpdateProjectConfigurationSettingsArgs";
import { ProjectConfigurationSettingsService } from "./projectConfigurationSettings.service";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";

@Resolver((of) => ProjectConfigurationSettings)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ProjectConfigurationSettingsResolver {
  constructor(private readonly service: ProjectConfigurationSettingsService) {}

  @Mutation(() => ProjectConfigurationSettings, { nullable: true })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async updateProjectConfigurationSettings(
    @Args() args: UpdateProjectConfigurationSettingsArgs,
    @UserEntity() user: User
  ): Promise<ProjectConfigurationSettings> {
    return this.service.update(args, user);
  }

  @Query(() => ProjectConfigurationSettings, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async projectConfigurationSettings(
    @Args() args: FindOneArgs
  ): Promise<ProjectConfigurationSettings> {
    return this.service.findOne(args);
  }
}
