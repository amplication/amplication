import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ServiceSettingsService } from './serviceSettings.service';
import { ServiceSettings, UpdateServiceSettingsArgs } from './dto';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableOriginParameter } from 'src/enums/AuthorizableOriginParameter';
import { FindOneArgs } from 'src/dto';
import { UserEntity } from 'src/decorators/user.decorator';
import { User } from 'src/models';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

@Resolver(() => ServiceSettings)
@UseGuards(GqlAuthGuard)
export class ServiceSettingsResolver {
  constructor(private readonly service: ServiceSettingsService) {}

  @Mutation(() => ServiceSettings, {
    nullable: true
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, 'where.id')
  async updateServiceSettings(
    @Args() args: UpdateServiceSettingsArgs,
    @UserEntity() user: User
  ): Promise<ServiceSettings> {
    return this.service.updateServiceSettings(args, user);
  }

  @Query(() => ServiceSettings, {
    nullable: false
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, 'where.id')
  async serviceSettings(
    @Args() args: FindOneArgs,
    @UserEntity() user: User
  ): Promise<ServiceSettings> {
    return this.service.getServiceSettingsBlock(args, user);
  }
}
