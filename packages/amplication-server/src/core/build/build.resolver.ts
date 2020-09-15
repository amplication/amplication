import { UseGuards, UseFilters } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  Parent,
  ResolveField
} from '@nestjs/graphql';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Build } from './dto/Build';
import { BuildLog } from './dto/BuildLog';
import { CreateBuildArgs } from './dto/CreateBuildArgs';
import { FindOneBuildArgs } from './dto/FindOneBuildArgs';
import { FindManyBuildArgs } from './dto/FindManyBuildArgs';
import { FindManyBuildLogArgs } from './dto/FindManyBuildLogArgs';
import { BuildService } from './build.service';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { User } from 'src/models';
import { UserService } from '../user/user.service';

@Resolver(() => Build)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class BuildResolver {
  constructor(
    private readonly service: BuildService,
    private readonly userService: UserService
  ) {}

  @Query(() => [Build])
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async builds(@Args() args: FindManyBuildArgs): Promise<Build[]> {
    return this.service.findMany(args);
  }

  @Query(() => Build)
  @AuthorizeContext(AuthorizableResourceParameter.BuildId, 'where.id')
  async build(@Args() args: FindOneBuildArgs): Promise<Build> {
    return this.service.findOne(args);
  }

  @ResolveField()
  async createdBy(@Parent() build: Build): Promise<User> {
    return this.userService.findUser({ where: { id: build.userId } });
  }

  @ResolveField()
  archiveURI(@Parent() build: Build): string {
    return `/generated-apps/${build.id}.zip`;
  }

  // @ResolveField(() => [BuildLog])
  // async logs(@Parent() build: Build, @Args() args: FindManyBuildLogArgs) {
  //   return this.service.getLogs({
  //     ...args,
  //     where: {
  //       ...args.where,
  //       build: {
  //         id: build.id
  //       }
  //     }
  //   });
  // }

  @Mutation(() => Build)
  @InjectContextValue(
    InjectableResourceParameter.UserId,
    'data.createdBy.connect.id'
  )
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  async createBuild(@Args() args: CreateBuildArgs): Promise<Build> {
    return this.service.create(args);
  }
}
