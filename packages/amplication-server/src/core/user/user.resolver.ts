import { Resolver, Parent, ResolveField } from "@nestjs/graphql";
import { User, Account } from "../../models";
import { UserService } from "../";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { UseGuards, UseFilters } from "@nestjs/common";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";

@Resolver(() => User)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField(() => Account)
  async account(@Parent() user: User) {
    return await this.userService.getAccount(user.id);
  }
}
