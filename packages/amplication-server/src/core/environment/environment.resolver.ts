import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseFilters } from '@nestjs/common';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { UpdateOneEnvironmentArgs, Environment } from './dto';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { EnvironmentService } from './environment.service';

@Resolver(() => Environment)
@UseFilters(GqlResolverExceptionsFilter)
export class EnvironmentResolver {
  constructor(private readonly environmentService: EnvironmentService) {}

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
}
