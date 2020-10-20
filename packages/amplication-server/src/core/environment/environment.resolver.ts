import {
  Args,
  Context,
  Mutation,
  Query,
  Parent,
  Resolver,
  ResolveField
} from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { UseFilters } from '@nestjs/common';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { UpdateOneEnvironmentArgs, Environment } from './dto';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { EnvironmentService } from './environment.service';

export const GCP_APPS_DOMAIN_VAR = 'GCP_APPS_DOMAIN';

@Resolver(() => Environment)
@UseFilters(GqlResolverExceptionsFilter)
export class EnvironmentResolver {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly configService: ConfigService
  ) {}

  @Mutation(() => Environment, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.EnvironmentId, 'where.id')
  async updateEnvironment(
    @Context() ctx: any,
    @Args() args: UpdateOneEnvironmentArgs
  ): Promise<Environment | null> {
    return this.environmentService.updateEnvironment(args);
  }

  @ResolveField()
  async url(@Parent() environment: Environment) {
    /**@todo: connect environment to a cloud provider and return the url dynamically  */
    return `https://${environment.address}.${this.configService.get(
      GCP_APPS_DOMAIN_VAR
    )}`;
  }
}
