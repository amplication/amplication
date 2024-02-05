import {
  Args,
  Mutation,
  Query,
  Resolver,
  Parent,
  ResolveField,
} from "@nestjs/graphql";
import {
  UpdateOneWorkspaceArgs,
  InviteUserArgs,
  CreateOneWorkspaceArgs,
  Invitation,
  WorkspaceMember,
  DeleteUserArgs,
  RevokeInvitationArgs,
  ResendInvitationArgs,
} from "./dto";
import { FindOneArgs } from "../../dto";

import { Workspace, User, Project } from "../../models";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { UseFilters, UseGuards } from "@nestjs/common";
import { UserEntity } from "../../decorators/user.decorator";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { WorkspaceService } from "./workspace.service";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { GitOrganization } from "../../models/GitOrganization";
import { Subscription } from "../subscription/dto/Subscription";
import { ProjectService } from "../project/project.service";
import { BillingService } from "../billing/billing.service";
import { ProvisionSubscriptionArgs } from "./dto/ProvisionSubscriptionArgs";
import { ProvisionSubscriptionResult } from "./dto/ProvisionSubscriptionResult";
import { SubscriptionService } from "../subscription/subscription.service";
import { UserService } from "../user/user.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { RedeemCouponArgs } from "./dto/RedeemCouponArgs";
import { Coupon } from "./dto/Coupon";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";

@Resolver(() => Workspace)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class WorkspaceResolver {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly projectService: ProjectService,
    private readonly billingService: BillingService,
    private readonly subscriptionService: SubscriptionService,
    private readonly analytics: SegmentAnalyticsService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  @Query(() => String, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.WorkspaceId, "where.id")
  async contactUsLink(@Args() args: FindOneArgs): Promise<string | null> {
    if (args.where.id) {
      return this.configService.get<string>(Env.CONTACT_US_LINK);
    }
  }

  @Query(() => Workspace, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.WorkspaceId, "where.id")
  async workspace(@Args() args: FindOneArgs): Promise<Workspace | null> {
    return this.workspaceService.getWorkspace(args);
  }

  @Query(() => Workspace, {
    nullable: true,
  })
  async currentWorkspace(
    @UserEntity() currentUser: User
  ): Promise<Workspace | null> {
    await this.analytics.track({
      userId: currentUser.account.id,
      properties: {
        workspaceId: currentUser.workspace.id,
        $groups: { groupWorkspace: currentUser.workspace.id },
      },
      event: EnumEventType.WorkspaceSelected,
    });
    await this.userService.setLastActivity(currentUser.id);
    const externalId = await this.userService.setNotificationRegistry(
      currentUser
    );

    await this.workspaceService.migrateWorkspace(
      currentUser.workspace,
      currentUser
    );

    return { ...currentUser.workspace, externalId };
  }

  @ResolveField(() => [Project])
  async projects(@Parent() workspace: Workspace): Promise<Project[]> {
    return this.projectService.findProjects({
      where: { workspace: { id: workspace.id } },
    });
  }

  @Mutation(() => Workspace, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.WorkspaceId, "where.id")
  async deleteWorkspace(@Args() args: FindOneArgs): Promise<Workspace | null> {
    return this.workspaceService.deleteWorkspace(args);
  }

  @Mutation(() => Workspace, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.WorkspaceId, "where.id")
  async updateWorkspace(
    @Args() args: UpdateOneWorkspaceArgs
  ): Promise<Workspace | null> {
    return this.workspaceService.updateWorkspace(args);
  }

  @Mutation(() => Workspace, {
    nullable: true,
  })
  async createWorkspace(
    @UserEntity() currentUser: User,
    @Args() args: CreateOneWorkspaceArgs
  ): Promise<Workspace | null> {
    return this.workspaceService.createWorkspace(
      currentUser.account.id,
      args,
      currentUser.workspace.id
    );
  }

  @Mutation(() => Invitation, {
    nullable: true,
  })
  async inviteUser(
    @UserEntity() currentUser: User,
    @Args() args: InviteUserArgs
  ): Promise<Invitation> {
    return this.workspaceService.inviteUser(currentUser, args);
  }

  @Mutation(() => Invitation, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.InvitationId, "where.id")
  async revokeInvitation(
    @Args() args: RevokeInvitationArgs
  ): Promise<Invitation> {
    return this.workspaceService.revokeInvitation(args);
  }

  @Mutation(() => Invitation, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.InvitationId, "where.id")
  async resendInvitation(
    @Args() args: ResendInvitationArgs
  ): Promise<Invitation> {
    return this.workspaceService.resendInvitation(args);
  }

  @Mutation(() => User, {
    nullable: true,
  })
  async deleteUser(
    @UserEntity() currentUser: User,
    @Args() args: DeleteUserArgs
  ): Promise<User> {
    return this.workspaceService.deleteUser(currentUser, args);
  }

  @Query(() => [WorkspaceMember], {
    nullable: true,
  })
  async workspaceMembers(
    @UserEntity() currentUser: User
  ): Promise<WorkspaceMember[]> {
    return this.workspaceService.findMembers({
      where: { id: currentUser.workspace.id },
    });
  }

  @ResolveField(() => Subscription, { nullable: true })
  async subscription(@Parent() workspace: Workspace): Promise<Subscription> {
    return await this.subscriptionService.resolveSubscription(workspace.id);
  }

  @ResolveField(() => [GitOrganization])
  async gitOrganizations(
    @Parent() workspace: Workspace
  ): Promise<GitOrganization[]> {
    return this.workspaceService.findManyGitOrganizations(workspace.id);
  }

  @Mutation(() => ProvisionSubscriptionResult, {
    nullable: true,
  })
  async provisionSubscription(
    @UserEntity() currentUser: User,
    @Args() args: ProvisionSubscriptionArgs
  ): Promise<ProvisionSubscriptionResult | null> {
    return this.billingService.provisionSubscription({
      ...args.data,
      userId: currentUser.account.id,
    });
  }

  @Mutation(() => Coupon)
  @UseGuards(GqlAuthGuard)
  async redeemCoupon(
    @UserEntity() user: User,
    @Args() args: RedeemCouponArgs
  ): Promise<Coupon> {
    return this.workspaceService.redeemCoupon(user, args);
  }
}
