import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppSettingsService } from './appSettings.service';
import { AppSettings, UpdateAppSettingsArgs } from './dto';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { FindOneArgs } from 'src/dto';

@Resolver(() => AppSettings)
export class AppSettingsResolver {
  constructor(private readonly service: AppSettingsService) {}

  @Mutation(() => AppSettings, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async updateAppSettings(
    @Args() args: UpdateAppSettingsArgs
  ): Promise<AppSettings> {
    return this.service.updateAppSettings(args);
  }

  @Query(() => AppSettings, {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async appSettings(@Args() args: FindOneArgs): Promise<AppSettings> {
    return this.service.getAppSettingsBlock(args);
  }
}
