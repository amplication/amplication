import { Resolver, Parent, ResolveField, Args, Query } from "@nestjs/graphql";
import { User, Account, Team } from "../../models";
import { UserService } from "../";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { UseGuards, UseFilters } from "@nestjs/common";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { FindOneArgs } from "../../dto";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";

@Resolver(() => User)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField(() => Account)
  async account(@Parent() user: User) {
    if (user.account === null) {
      return await this.userService.getAccount(user.id);
    }
    return user.account;
  }

  @ResolveField(() => [Team])
  async teams(@Parent() user: User): Promise<Team[]> {
    return await this.userService.getTeams(user.id);
  }

  @Query(() => User, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.UserId, "where.id")
  async user(@Args() args: FindOneArgs): Promise<User> {
    return this.userService.findUser(args);
  }
}
