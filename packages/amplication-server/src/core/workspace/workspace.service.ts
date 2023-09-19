import { ConflictException, Injectable } from "@nestjs/common";
import { User, Workspace } from "../../models";
import { Prisma, PrismaService } from "../../prisma";
import {
  CompleteInvitationArgs,
  DeleteUserArgs,
  FindManyWorkspaceArgs,
  InviteUserArgs,
  ResendInvitationArgs,
  RevokeInvitationArgs,
  UpdateOneWorkspaceArgs,
  WorkspaceMember,
} from "./dto";
import { Invitation } from "./dto/Invitation";

import cuid from "cuid";
import { addDays } from "date-fns";
import { isEmpty } from "lodash";
import { FindOneArgs } from "../../dto";
import { Role } from "../../enums/Role";
import { GitOrganization } from "../../models/GitOrganization";
import {
  EnumEventType,
  SegmentAnalyticsService,
} from "../../services/segmentAnalytics/segmentAnalytics.service";
import { BillingService } from "../billing/billing.service";
import { BillingPlan } from "../billing/billing.types";
import { MailService } from "../mail/mail.service";
import { ProjectService } from "../project/project.service";
import { EnumSubscriptionPlan } from "../subscription/dto";
import { Subscription } from "../subscription/dto/Subscription";
import { SubscriptionService } from "../subscription/subscription.service";
import { UserService } from "../user/user.service";
import { EnumWorkspaceMemberType } from "./dto/EnumWorkspaceMemberType";
import { RedeemCouponArgs } from "./dto/RedeemCouponArgs";
import { BillingPeriod } from "@stigg/node-server-sdk";
import { Coupon } from "./dto/Coupon";

const INVITATION_EXPIRATION_DAYS = 7;

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly subscriptionService: SubscriptionService,
    private readonly projectService: ProjectService,
    private readonly billingService: BillingService,
    private analytics: SegmentAnalyticsService
  ) {}

  async getWorkspace(args: FindOneArgs): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique(args);
  }

  async getWorkspaces(args: FindManyWorkspaceArgs): Promise<Workspace[]> {
    return this.prisma.workspace.findMany(args);
  }

  async deleteWorkspace(args: FindOneArgs): Promise<Workspace | null> {
    return this.prisma.workspace.delete(args);
  }

  async updateWorkspace(
    args: UpdateOneWorkspaceArgs
  ): Promise<Workspace | null> {
    return this.prisma.workspace.update(args);
  }

  /**
   * Creates a workspace and a user within it for the provided account with workspace admin role
   * @param accountId the account to create the user in the created workspace
   * @param args arguments to pass to workspace creations
   * @returns the created workspace
   */
  async createWorkspace(
    accountId: string,
    args: Prisma.WorkspaceCreateArgs
  ): Promise<Workspace> {
    // Create workspace
    // Create a new user and link it to the account
    // Assign the user an "ORGANIZATION_ADMIN" role
    const workspace = await this.prisma.workspace.create({
      ...args,
      data: {
        ...args.data,
        users: {
          create: {
            account: { connect: { id: accountId } },
            isOwner: true,
            userRoles: {
              create: {
                role: Role.OrganizationAdmin,
              },
            },
          },
        },
      },
      include: {
        ...args.include,
        // Include users by default, allow to bypass it for including additional user links
        users: args?.include?.users || true,
      },
    });

    await this.billingService.provisionCustomer(workspace.id, BillingPlan.Free);

    const [user] = workspace.users;

    await this.projectService.createProject(
      {
        data: {
          name: "Sample Project",
          workspace: { connect: { id: workspace.id } },
        },
      },
      user.id
    );

    return workspace;
  }

  async inviteUser(
    currentUser: User,
    args: InviteUserArgs
  ): Promise<Invitation | null> {
    const { workspace, id: currentUserId, account } = currentUser;

    if (isEmpty(args.data.email)) {
      throw new ConflictException(`email address is required to invite a user`);
    }

    const existingUsers = await this.userService.findUsers({
      where: {
        account: { email: args.data.email },
        workspace: { id: workspace.id },
      },
    });

    if (existingUsers.length) {
      throw new ConflictException(
        `User with email ${args.data.email} already exist in the workspace.`
      );
    }

    const existingInvitation = await this.prisma.invitation.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        workspaceId_email: {
          email: args.data.email,
          workspaceId: workspace.id,
        },
      },
    });

    if (existingInvitation) {
      throw new ConflictException(
        `Invitation with email ${args.data.email} already exist in the workspace.`
      );
    }

    const currentUserAccount = await this.prisma.account.findUnique({
      where: {
        id: account.id,
      },
    });

    const invitation = await this.prisma.invitation.create({
      data: {
        email: args.data.email,
        workspace: {
          connect: {
            id: workspace.id,
          },
        },
        invitedByUser: {
          connect: {
            id: currentUserId,
          },
        },
        token: cuid(),
        tokenExpiration: addDays(new Date(), INVITATION_EXPIRATION_DAYS),
      },
    });

    await this.mailService.sendInvitation({
      to: invitation.email,
      invitationToken: invitation.token,
      invitedByUserFullName: currentUserAccount.email,
    });

    return invitation;
  }

  async completeInvitation(
    currentUser: User,
    args: CompleteInvitationArgs
  ): Promise<Workspace> {
    const { account } = currentUser;

    const invitations = await this.prisma.invitation.findMany({
      where: {
        token: args.data.token,
        tokenExpiration: {
          gt: addDays(new Date(), -INVITATION_EXPIRATION_DAYS),
        },
        newUser: null,
      },
    });

    if (!(invitations && invitations.length === 1)) {
      throw new ConflictException(
        `Invitation cannot be found or it has expired`
      );
    }

    const [invitation] = invitations;

    const existingUsers = await this.userService.findUsers({
      where: {
        account: { id: account.id },
        workspace: { id: invitation.workspaceId },
      },
    });

    if (!isEmpty(existingUsers)) {
      throw new ConflictException(
        `The current account is already a member in this workspace`
      );
    }

    const workspace = await this.prisma.workspace.update({
      where: {
        id: invitation.workspaceId,
      },
      data: {
        users: {
          create: {
            account: { connect: { id: account.id } },
            isOwner: false,
            userRoles: {
              create: {
                role: Role.OrganizationAdmin,
              },
            },
          },
        },
      },
      include: {
        users: {
          where: {
            account: {
              id: account.id,
            },
          },
        },
      },
    });

    const [newUser] = workspace.users;

    await this.prisma.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        tokenExpiration: addDays(new Date(), -INVITATION_EXPIRATION_DAYS),
        newUser: {
          connect: {
            id: newUser.id,
          },
        },
      },
    });

    await this.analytics.track({
      userId: account.id,
      event: EnumEventType.InvitationAcceptance,
      properties: {
        workspaceId: invitation.workspaceId,
      },
    });

    return workspace;
  }

  async revokeInvitation(args: RevokeInvitationArgs): Promise<Invitation> {
    const invitation = await this.prisma.invitation.findFirst({
      ...args,
      where: {
        ...args.where,
        newUser: null,
      },
    });

    if (!invitation) {
      throw new ConflictException(`Invitation cannot be found`);
    }

    return this.prisma.invitation.delete({
      where: {
        id: invitation.id,
      },
    });
  }

  async resendInvitation(args: ResendInvitationArgs): Promise<Invitation> {
    const invitation = await this.prisma.invitation.findFirst({
      ...args,
      where: {
        ...args.where,
        newUser: null,
      },
      include: {
        invitedByUser: {
          include: {
            account: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new ConflictException(`Invitation cannot be found`);
    }

    const updatedInvitation = await this.prisma.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        tokenExpiration: addDays(new Date(), INVITATION_EXPIRATION_DAYS),
      },
    });

    await this.mailService.sendInvitation({
      to: invitation.email,
      invitationToken: invitation.token,
      invitedByUserFullName: invitation.invitedByUser.account.email,
    });

    return updatedInvitation;
  }

  async redeemCoupon(
    currentUser: User,
    args: RedeemCouponArgs
  ): Promise<Coupon> {
    const { account } = currentUser;

    const coupons = await this.prisma.coupon.findMany({
      where: {
        code: args.data.code,
        newUser: null,
        redemptionAt: null,
      },
    });

    if (!(coupons && coupons.length === 1)) {
      throw new ConflictException(`coupon cannot be found or it has expired`);
    }

    const [coupon] = coupons;

    if (coupon.expiration < new Date()) {
      throw new ConflictException(`coupon is expired`);
    }

    const subscription = await this.subscriptionService.resolveSubscription(
      currentUser.workspace.id
    );

    if (subscription.subscriptionPlan !== EnumSubscriptionPlan.Free) {
      throw new ConflictException(
        `The coupon cannot be applied on the current subscription`
      );
    }

    //use stigg API to provision a new trial subscription
    await this.billingService.provisionSubscription({
      workspaceId: currentUser.workspace.id,
      planId: BillingPlan.ProWithTrial,
      cancelUrl: "",
      successUrl: "",
      userId: account.id,
      billingPeriod: BillingPeriod.Monthly,
      intentionType: "UPGRADE_PLAN",
    });
    await this.prisma.coupon.update({
      where: {
        id: coupon.id,
      },
      data: {
        redemptionAt: new Date(),
        newUser: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await this.analytics.track({
      userId: account.id,
      event: EnumEventType.RedeemCoupon,
      properties: {
        workspaceId: currentUser.workspace.id,
        subscriptionPlan: coupon.subscriptionPlan,
        durationMonths: coupon.durationMonths,
      },
    });

    return coupon;
  }

  async findMembers(args: FindOneArgs): Promise<WorkspaceMember[]> {
    const users = await this.userService.findUsers({
      where: {
        workspaceId: args.where.id,
      },
    });

    const invitations = await this.prisma.invitation.findMany({
      where: {
        workspaceId: args.where.id,
        newUser: null,
      },
    });

    return users
      .map((user): WorkspaceMember => {
        return {
          member: user,
          type: EnumWorkspaceMemberType.User,
        };
      })
      .concat(
        invitations.map((invitation): WorkspaceMember => {
          return {
            member: invitation,
            type: EnumWorkspaceMemberType.Invitation,
          };
        })
      );
  }

  async deleteUser(currentUser: User, args: DeleteUserArgs): Promise<User> {
    const user = await this.userService.findUser({
      ...args,
      include: {
        workspace: true,
      },
    });

    if (!user) {
      throw new ConflictException(`Can't find user ${args.where.id}`);
    }
    if (user.isOwner) {
      throw new ConflictException(`Can't delete the workspace owner`);
    }

    if (currentUser.workspace.id !== user.workspace.id) {
      throw new ConflictException(
        `The requested user is not in the current user's workspace`
      );
    }

    return this.userService.delete(args.where.id);
  }

  async getSubscription(workspaceId: string): Promise<Subscription | null> {
    return await this.subscriptionService.getCurrentSubscription(workspaceId);
  }

  async findManyGitOrganizations(
    workspaceId: string
  ): Promise<GitOrganization[]> {
    return this.prisma.workspace
      .findUnique({ where: { id: workspaceId } })
      .gitOrganizations();
  }
}
