import { UseGuards, UseFilters } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Build } from './dto/Build';
import { CreateBuildArgs } from './dto/CreateBuildArgs';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { FindManyBuildArgs } from './dto/FindManyBuildArgs';
import { BuildService } from './build.service';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';

@Resolver(() => Build)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class BuildResolver {
  constructor(private readonly service: BuildService) {}

  @Query(() => [Build])
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async findMany(@Args() args: FindManyBuildArgs): Promise<Build[]> {
    return this.service.findMany(args);
  }

  @Mutation(() => String)
  @AuthorizeContext(AuthorizableResourceParameter.BuildId, 'where.id')
  async createSignedURL(@Args() args: FindOneBuildArgs): Promise<string> {
    return this.service.createSignedURL(args);
  }

  @Mutation(() => Build)
  @InjectContextValue(
    InjectableResourceParameter.UserId,
    'data.createdBy.connect.id'
  )
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  async create(@Args() args: CreateBuildArgs): Promise<Build> {
    return this.service.create(args);
  }
}
