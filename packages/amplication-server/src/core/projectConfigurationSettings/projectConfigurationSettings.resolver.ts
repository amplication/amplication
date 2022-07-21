import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserEntity } from 'src/decorators/user.decorator';
import { FindOneArgs } from 'src/dto';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { User } from 'src/models';
import { ProjectConfigurationSettings } from './dto/ProjectConfigurationSettings';
import { UpdateProjectConfigurationSettingsArgs } from './dto/UpdateProjectConfigurationSettingsArgs';
import { ProjectConfigurationSettingsService } from './projectConfigurationSettings.service';

@Resolver(of => ProjectConfigurationSettings)
@UseGuards(GqlAuthGuard)
export class ProjectConfigurationSettingsResolver {
  constructor(private readonly service: ProjectConfigurationSettingsService) {}

  @Mutation(() => ProjectConfigurationSettings, { nullable: true })
  async updateProjectConfigurationSettings(
    @Args() args: UpdateProjectConfigurationSettingsArgs,
    @UserEntity() user: User
  ): Promise<ProjectConfigurationSettings> {
    return this.service.update(args, user);
  }

  @Query(() => ProjectConfigurationSettings, { nullable: false })
  // @AuthorizeContext(AuthorizableResourceParameter.ResourceId, 'where.id') //TODO?
  async projectConfigurationSettings(
    @Args() args: FindOneArgs
  ): Promise<ProjectConfigurationSettings> {
    return this.service.findOne(args);
  }
}
