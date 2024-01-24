import { UseFilters, UseGuards } from "@nestjs/common";
import { Resolver, Query, Args, Parent, ResolveField } from "@nestjs/graphql";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { UserAction } from "./dto";
import { FindOneUserActionArgs } from "./dto/FindOneUserActionArgs";
import { UserActionService } from "./userAction.service";
import { EnumUserActionStatus } from "./types";
import { Action } from "../action/dto";
import { ActionService } from "../action/action.service";
import { UserService } from "../user/user.service";
import { ResourceService } from "../resource/resource.service";
import { Resource, User } from "../../models";

@Resolver(() => UserAction)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class UserActionResolver {
  constructor(
    private readonly userActionService: UserActionService,
    private readonly actionService: ActionService,
    private readonly userService: UserService,
    private readonly resourceService: ResourceService
  ) {}

  @Query(() => UserAction)
  @AuthorizeContext(AuthorizableOriginParameter.UserActionId, "where.id")
  async userAction(@Args() args: FindOneUserActionArgs): Promise<UserAction> {
    return this.userActionService.findOne(args);
  }

  @ResolveField()
  status(@Parent() userAction: UserAction): Promise<EnumUserActionStatus> {
    return this.userActionService.calcUserActionStatus(userAction.id);
  }

  @ResolveField()
  async action(@Parent() userAction: UserAction): Promise<Action> {
    return this.actionService.findOne({ where: { id: userAction.actionId } });
  }

  @ResolveField()
  async resource(@Parent() userAction: UserAction): Promise<Resource> {
    return this.resourceService.resource({
      where: { id: userAction.resourceId },
    });
  }

  @ResolveField()
  async user(@Parent() userAction: UserAction): Promise<User> {
    return this.userService.findUser(
      { where: { id: userAction.userId } },
      true
    );
  }
}
