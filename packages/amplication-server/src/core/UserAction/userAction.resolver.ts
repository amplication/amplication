import { UseFilters, UseGuards } from "@nestjs/common";
import { Resolver, Query, Args } from "@nestjs/graphql";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { UserAction } from "./dto";
import { FindOneUserActionArgs } from "./dto/FindOneUserActionArgs";
import { UserActionService } from "./userAction.service";

@Resolver(() => UserAction)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class UserActionResolver {
  constructor(private readonly userActionService: UserActionService) {}

  @Query(() => UserAction)
  @AuthorizeContext(AuthorizableOriginParameter.BuildId, "where.id")
  async userAction(@Args() args: FindOneUserActionArgs): Promise<UserAction> {
    return this.userActionService.findOne(args);
  }
}
