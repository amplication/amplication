import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppSettingsService } from './appSettings.service';
import { AppSettings, UpdateAppSettingsArgs } from './dto';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { FindOneArgs } from 'src/dto';
import { UserEntity } from 'src/decorators/user.decorator';
import { User } from 'src/models';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

@Resolver(() => AppSettings)
@UseGuards(GqlAuthGuard)
export class AppSettingsResolver {
  constructor(private readonly service: AppSettingsService) {}

  @Mutation(() => AppSettings, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.ResourceId, 'where.id')
  async updateAppSettings(
    @Args() args: UpdateAppSettingsArgs,
    @UserEntity() user: User
  ): Promise<AppSettings> {
    return this.service.updateAppSettings(args, user);
  }

  @Query(() => AppSettings, {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.ResourceId, 'where.id')
  async appSettings(
    @Args() args: FindOneArgs,
    @UserEntity() user: User
  ): Promise<AppSettings> {
    return this.service.getAppSettingsBlock(args, user);
  }
}
