import { ConflictException, Inject, Injectable } from "@nestjs/common";
import {
  Account,
  Entity,
  EntityField,
  Project,
  Resource,
  User,
  Workspace,
} from "../../models";
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
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { BillingService } from "../billing/billing.service";
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
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import {
  EnumAuthProviderType,
  EnumBlockType,
  EnumDataType,
} from "@amplication/code-gen-types";
import { ModuleService } from "../module/module.service";
import { ModuleActionService } from "../moduleAction/moduleAction.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { BillingFeature, BillingPlan } from "@amplication/util-billing-types";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { Env } from "../../env";
import { ConfigService } from "@nestjs/config";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";
import { ResourceService } from "../resource/resource.service";
import { generateRandomString } from "../auth/auth-utils";
import { AuthUser, CreatePreviewServiceSettingsArgs } from "../auth/types";
import { ModuleDtoService } from "../moduleDto/moduleDto.service";
import { types } from "@amplication/code-gen-types";
import { DefaultModuleForEntityNotFoundError } from "../module/DefaultModuleForEntityNotFoundError";
import { ModuleDto } from "../moduleDto/dto/ModuleDto";
import { EnumCodeGenerator } from "../resource/dto/EnumCodeGenerator";
import { CreateOneResourceArgs } from "../resource/dto";

const INVITATION_EXPIRATION_DAYS = 7;

type PreviewAccountEnvironment = {
  workspace: Workspace & {
    users: AuthUser[];
  };
  project: Project;
  resource?: Resource;
};

@Injectable()
export class WorkspaceService {
  private userLastActiveDays: number;
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly subscriptionService: SubscriptionService,
    private readonly projectService: ProjectService,
    private readonly resourceService: ResourceService,
    private readonly billingService: BillingService,
    private analytics: SegmentAnalyticsService,
    private readonly moduleService: ModuleService,
    private readonly moduleDtoService: ModuleDtoService,
    private readonly moduleActionService: ModuleActionService,
    private readonly configService: ConfigService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {
    this.userLastActiveDays =
      Number(this.configService.get<string>(Env.USER_LAST_ACTIVE_DAYS)) ?? 30;
  }

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

  async createPreviewWorkspace(
    args: Prisma.WorkspaceCreateArgs,
    accountId: string
  ): Promise<Workspace> {
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

    const account = await this.prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });

    await this.billingService.provisionPreviewCustomer(
      workspace.id,
      EnumPreviewAccountType[account.previewAccountType]
    );

    await this.billingService.reportUsage(
      workspace.id,
      BillingFeature.TeamMembers
    );

    return workspace;
  }

  async convertPreviewSubscriptionToFreeWithTrial(workspaceId: string) {
    await this.billingService.provisionNewSubscriptionForPreviewAccount(
      workspaceId
    );
  }

  private async shouldBlockWorkspaceCreation(
    workspaceId: string
  ): Promise<boolean> {
    if (!this.billingService.isBillingEnabled) {
      return false;
    }

    const blockWorkspaceCreation =
      await this.billingService.getBooleanEntitlement(
        workspaceId,
        BillingFeature.BlockWorkspaceCreation
      );

    return blockWorkspaceCreation.hasAccess;
  }

  /**
   * Creates a workspace and a user within it for the provided account with workspace admin role
   * @param accountId the account to create the user in the created workspace
   * @param args arguments to pass to workspace creations
   * @returns the created workspace
   */
  async createWorkspace(
    accountId: string,
    args: Prisma.WorkspaceCreateArgs,
    currentWorkspaceId?: string,
    connectToDemoRepo?: boolean
  ): Promise<Workspace> {
    if (await this.shouldBlockWorkspaceCreation(currentWorkspaceId)) {
      const message = "Your current plan does not allow creating workspaces";
      throw new BillingLimitationError(
        message,
        BillingFeature.BlockWorkspaceCreation
      );
    }
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

    await this.billingService.provisionCustomer(workspace.id);

    const [user] = workspace.users;
    const newProject = await this.projectService.createProject(
      {
        data: {
          name: "Sample Project",
          workspace: { connect: { id: workspace.id } },
        },
      },
      user.id
    );

    if (connectToDemoRepo) {
      await this.projectService.createDemoRepo(newProject.id, user);
    }

    await this.billingService.reportUsage(
      workspace.id,
      BillingFeature.TeamMembers
    );

    return workspace;
  }

  private async canInvite(workspaceId: string): Promise<boolean> {
    if (!this.billingService.isBillingEnabled) {
      return false;
    }

    const workspaceMembers = await this.billingService.getMeteredEntitlement(
      workspaceId,
      BillingFeature.TeamMembers
    );

    return !workspaceMembers.usageLimit
      ? true
      : workspaceMembers.currentUsage < workspaceMembers.usageLimit;
  }

  async inviteUser(
    currentUser: User,
    args: InviteUserArgs
  ): Promise<Invitation | null> {
    const canInvite = await this.canInvite(currentUser.workspace.id);
    if (!canInvite) {
      const message = `Your workspace exceeds its members limitation.`;
      throw new BillingLimitationError(message, BillingFeature.Projects);
    }

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

    await this.billingService.reportUsage(
      workspace.id,
      BillingFeature.TeamMembers
    );

    await this.analytics.trackWithContext({
      event: EnumEventType.InvitationAcceptance,
      properties: {},
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
      accountId: account.id,
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

    await this.analytics.trackWithContext({
      event: EnumEventType.RedeemCoupon,
      properties: {
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

  chunkArrayInGroups(arr, size) {
    const myArray = [];
    for (let i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i + size));
    }
    return myArray;
  }

  async dataMigrateWorkspacesResourcesCustomActions(
    quantity: number
  ): Promise<boolean> {
    const workspaces = await this.prisma.workspace.findMany({
      where: {
        projects: {
          some: {
            deletedAt: null,
            resources: {
              some: {
                deletedAt: null,
                archived: { not: true },
                resourceType: EnumResourceType.Service,
                blocks: { none: { blockType: EnumBlockType.Module } },
                entities: { some: { deletedAt: null } },
              },
            },
          },
        },
      },
      take: quantity,
      include: {
        users: {
          orderBy: {
            lastActive: Prisma.SortOrder.asc,
          },
        },
        projects: {
          where: {
            deletedAt: null,
          },
          include: {
            resources: {
              include: {
                entities: {
                  where: {
                    deletedAt: null,
                  },
                },
              },
              where: {
                resourceType: EnumResourceType.Service,
                deletedAt: null,
                archived: { not: true },
              },
            },
          },
        },
      },
    });

    let index = 1;

    const workspaceChunks = this.chunkArrayInGroups(workspaces, 200);

    for (const workspaceChunk of workspaceChunks) {
      this.logger.info(`chunk number ${index++}`);
      await this.migrateWorkspaces(workspaceChunk, false);
    }

    await this.prisma.$disconnect();

    return true;
  }

  async dataMigrateWorkspacesResourcesCustomDtos(
    quantity: number,
    page?: number
  ): Promise<boolean> {
    this.logger.info(`Migrating started`, {
      context: WorkspaceService.name,
      method: this.dataMigrateWorkspacesResourcesCustomDtos.name,
    });

    let currentPage = page || 1;

    let hasMore = true;
    const processedWorkspaces: string[] = [];

    do {
      // get latest active users by chunks of quantity
      const latestActive = await this.prisma.user.findMany({
        skip: page ? (currentPage - 1) * quantity : 0,
        take: quantity,
        orderBy: {
          lastActive: "desc",
        },
        where: {
          workspace: {
            id: { notIn: processedWorkspaces },
            projects: {
              some: {
                deletedAt: null,
                resources: {
                  some: {
                    deletedAt: null,
                    archived: { not: true },
                    resourceType: EnumResourceType.Service,
                    entities: { some: { deletedAt: null } },
                  },
                },
              },
            },
          },
          lastActive: { not: null },
        },
        include: {
          workspace: {
            include: {
              projects: {
                where: {
                  deletedAt: null,
                },
                include: {
                  resources: {
                    include: {
                      blocks: {
                        where: {
                          blockType: EnumBlockType.ModuleDto,
                        },
                      },
                      entities: {
                        where: {
                          deletedAt: null,
                        },
                      },
                    },
                    where: {
                      resourceType: EnumResourceType.Service,
                      deletedAt: null,
                      archived: { not: true },
                    },
                  },
                },
              },
              users: {
                orderBy: {
                  lastActive: Prisma.SortOrder.desc,
                },
                take: 1,
              },
            },
          },
        },
        distinct: ["workspaceId"],
      });

      const workspaces = latestActive.map((user) => user.workspace);
      processedWorkspaces.push(...workspaces.map((workspace) => workspace.id));

      this.logger.info(
        `Migrating workspaces... currentPage: ${currentPage}, quantity: ${quantity}`,
        {
          context: WorkspaceService.name,
          method: this.dataMigrateWorkspacesResourcesCustomDtos.name,
          workspacesId: workspaces.map((workspace) => workspace.id),
        }
      );

      hasMore = page === undefined && workspaces.length > 0;

      await Promise.all(
        workspaces.map(async (workspace) => {
          await this.migrateWorkspacesDefaultDtos(workspace);
        })
      );

      currentPage++;
    } while (hasMore);

    await this.prisma.$disconnect();

    const relevantWorkspaces = await this.prisma.workspace.findMany({
      where: {
        users: {
          some: {
            lastActive: { not: null },
          },
        },
        projects: {
          some: {
            deletedAt: null,
            resources: {
              some: {
                deletedAt: null,
                archived: { not: true },
                resourceType: EnumResourceType.Service,
                entities: { some: { deletedAt: null } },
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    this.logger.info(
      `Migrating completed. Workspaces processed: ${processedWorkspaces.length} out of ${relevantWorkspaces.length}`,
      {
        context: WorkspaceService.name,
        method: this.dataMigrateWorkspacesResourcesCustomDtos.name,
        workspacesProcessed: processedWorkspaces,
        relevantWorkspaces: relevantWorkspaces.map((workspace) => workspace.id),
      }
    );

    return true;
  }

  async dataMigrateWorkspacesResourcesCustomActionsFix(
    quantity: number
  ): Promise<boolean> {
    const workspaces = await this.prisma.workspace.findMany({
      where: {
        projects: {
          some: {
            deletedAt: null,
            resources: {
              some: {
                deletedAt: null,
                archived: { not: true },
                resourceType: EnumResourceType.Service,
                blocks: { some: { blockType: EnumBlockType.Module } },
                entities: { some: { deletedAt: null } },
              },
            },
          },
        },
        users: {
          some: {
            lastActive: { not: null },
          },
        },
      },
      take: quantity,
      include: {
        users: {
          orderBy: {
            lastActive: Prisma.SortOrder.desc,
          },
        },
        projects: {
          where: {
            deletedAt: null,
          },
          include: {
            resources: {
              include: {
                entities: {
                  where: {
                    deletedAt: null,
                  },
                },
              },
              where: {
                resourceType: EnumResourceType.Service,
                deletedAt: null,
                archived: { not: true },
              },
            },
          },
        },
      },
    });

    let index = 1;

    const workspaceChunks = this.chunkArrayInGroups(workspaces, 200);

    for (const workspaceChunk of workspaceChunks) {
      this.logger.info(`chunk number ${index++}`);
      await this.migrateWorkspaces(workspaceChunk, true);
    }

    await this.prisma.$disconnect();

    return true;
  }

  async migrateWorkspaces(workspaces: Workspace[], fixMigration: boolean) {
    const promises = workspaces.map(async (workspace) => {
      const workspaceUser = workspace.users[0];

      for (const project of workspace.projects) {
        const resources = project.resources;
        let hasChanges = false;

        if (fixMigration) {
          hasChanges = await this.createResourceCustomActionsFix(
            resources,
            workspaceUser
          );
        } else {
          hasChanges = await this.createResourceCustomActions(
            resources,
            workspaceUser
          );
        }

        if (hasChanges) {
          try {
            await this.projectService.commit(
              {
                data: {
                  message: "this is automatic commit for update custom actions",
                  project: {
                    connect: {
                      id: project.id,
                    },
                  },
                  user: {
                    connect: {
                      id: workspaceUser.id,
                    },
                  },
                },
              },
              workspaceUser,
              true // skip build
            );
          } catch (error) {
            this.logger.error(
              `Failed to run commit action, error: ${error} projectId: ${project.id}`
            );
          }
        }
      }
      const date = new Date();
      this.logger.info(
        `workspace process complete, workspaceId: ${
          workspace.id
        }, time: ${date.toUTCString()}`
      );
    });
    await Promise.all(promises);
  }

  async migrateWorkspacesDefaultDtos(workspace: Workspace, user?: User) {
    const workspaceUser = user ?? workspace.users[0];

    for (const project of workspace.projects) {
      const resources = project.resources;
      let hasChanges = false;

      hasChanges = await this.createResourceCustomDtos(
        resources,
        workspaceUser
      );

      if (hasChanges) {
        try {
          await this.projectService.commit(
            {
              data: {
                message:
                  "this is automatic commit to update custom actions and create default DTOs",
                project: {
                  connect: {
                    id: project.id,
                  },
                },
                user: {
                  connect: {
                    id: workspaceUser.id,
                  },
                },
              },
            },
            workspaceUser,
            true // skip build
          );
        } catch (error) {
          this.logger.error(
            `Failed to run commit action, error: ${error} projectId: ${project.id}`
          );
        }
      }
    }
    const date = new Date();
    this.logger.info(
      `workspace create default dto's process complete, workspaceId: ${
        workspace.id
      }, time: ${date.toUTCString()}`
    );
  }

  async migrateWorkspace(workspace: Workspace, currentUser: User) {
    const currentWorkspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspace.id,
        projects: {
          some: {
            deletedAt: null,
            resources: {
              some: {
                deletedAt: null,
                archived: { not: true },
                resourceType: EnumResourceType.Service,
                blocks: {
                  none: {
                    blockType: EnumBlockType.Module,
                  },
                },
                entities: { some: { deletedAt: null } },
              },
            },
          },
        },
      },
      include: {
        projects: {
          where: {
            deletedAt: null,
          },
          include: {
            resources: {
              include: {
                entities: {
                  where: {
                    deletedAt: null,
                  },
                },
              },
              where: {
                resourceType: EnumResourceType.Service,
                deletedAt: null,
                archived: { not: true },
              },
            },
          },
        },
      },
    });

    if (!currentWorkspace) return;

    for (const project of currentWorkspace.projects) {
      const resources = project.resources;

      const hasChanges = await this.createResourceCustomActions(
        resources,
        currentUser
      );

      if (hasChanges) {
        try {
          await this.projectService.commit(
            {
              data: {
                message: "this is automatic commit for update custom actions",
                project: {
                  connect: {
                    id: project.id,
                  },
                },
                user: {
                  connect: {
                    id: currentUser.id,
                  },
                },
              },
            },
            currentUser,
            true // skip build
          );
        } catch (error) {
          this.logger.error(
            `Failed to run commit action, error: ${error} projectId: ${project.id}`
          );
        }
      }
    }
  }

  async bulkUpdateWorkspaceProjectsAndResourcesLicensed(
    useUserLastActive: boolean
  ): Promise<boolean> {
    try {
      const date = new Date();
      const userLastActiveQuery = useUserLastActive
        ? {
            some: {
              lastActive: {
                gte: new Date(
                  date.setDate(date.getDate() - this.userLastActiveDays)
                ),
              },
            },
          }
        : {};

      const workspaces = await this.prisma.workspace.findMany({
        where: {
          users: userLastActiveQuery,
          projects: {
            some: {
              deletedAt: null,
              resources: {
                some: {
                  deletedAt: null,
                  archived: { not: true },
                  resourceType: {
                    in: [EnumResourceType.Service],
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

      for (const workspace of workspaces) {
        await this.subscriptionService.updateProjectLicensed(workspace.id);
        await this.subscriptionService.updateServiceLicensed(workspace.id);
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async createEntityCustomActions(
    entity: Entity,
    user: User
  ): Promise<boolean> {
    try {
      if (entity.name.trim() === "" || entity.name.trim() === null) return;
      const entityArgs = {
        data: {
          name: entity.name,
          displayName: entity.name,
          resource: {
            connect: {
              id: entity.resourceId,
            },
          },
        },
      };

      const module = await this.moduleService.createDefaultModuleForEntity(
        entityArgs,
        entity,
        user
      );

      const fields = (await this.prisma.entityField.findMany({
        where: {
          entityVersion: {
            entityId: entity.id,
            versionNumber: 0,
            deleted: null,
          },
        },
      })) as EntityField[];

      const relationFields = fields.filter(
        (e) => e.dataType === EnumDataType.Lookup
      );

      for (const field of relationFields) {
        try {
          await this.moduleActionService.createDefaultActionsForRelationField(
            entity,
            field,
            module.id,
            user
          );
        } catch (error) {
          this.logger.error(`${error.message} entityId: ${entity.id}`);
          return;
        }
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  private async createEntityCustomDtos(
    entity: Entity,
    user: User
  ): Promise<boolean> {
    try {
      if (entity.name.trim() === "" || entity.name.trim() === null)
        return false;

      const { resourceId, id } = entity;

      const entityModuleId =
        await this.moduleService.getDefaultModuleIdForEntity(resourceId, id);

      const newModuleDtos =
        await this.moduleDtoService.createDefaultDtosForEntityModule(
          entity,
          entityModuleId,
          user
        );

      const relationFields = await this.prisma.entityField.findMany({
        where: {
          entityVersion: {
            entityId: entity.id,
            versionNumber: 0,
            deleted: null,
          },
          dataType: { equals: EnumDataType.Lookup },
        },
      });

      const newRelatedModuleDtos: ModuleDto[] = [];

      for (const field of relationFields) {
        const properties = field.properties as unknown as types.Lookup;
        const relatedEntity = await this.prisma.entity.findUnique({
          where: {
            id: properties.relatedEntityId,
          },
        });

        try {
          newRelatedModuleDtos.push(
            ...(await this.moduleDtoService.createDefaultDtosForRelatedEntity(
              entity,
              field,
              relatedEntity,
              entityModuleId,
              user
            ))
          );
        } catch (error) {
          this.logger.error(`${error.message} entityId: ${entity.id}`);
          return false;
        }
      }
      if (newModuleDtos.length > 0 || newRelatedModuleDtos.length > 0) {
        return true;
      }
    } catch (error) {
      if (error instanceof DefaultModuleForEntityNotFoundError) {
        this.logger.warn(error.message);
        return false;
      }

      this.logger.error(error);
      return false;
    }

    return false;
  }

  async createEntityCustomActionsFix(
    entity: Entity,
    resourceId: string,
    user: User
  ): Promise<boolean> {
    try {
      if (entity.name.trim() === "" || entity.name.trim() === null) return;

      const entityModule = await this.prisma.block.findFirst({
        where: {
          blockType: EnumBlockType.Module,
          resourceId: resourceId,
          displayName: entity.name,
        },
      });

      if (!entityModule) {
        return false;
      }

      const fields = (await this.prisma.entityField.findMany({
        where: {
          entityVersion: {
            entityId: entity.id,
            versionNumber: 0,
            deleted: null,
          },
        },
      })) as EntityField[];

      const relationFields = fields.filter(
        (e) => e.dataType === EnumDataType.Lookup
      );

      for (const field of relationFields) {
        try {
          await this.moduleActionService.createDefaultActionsForRelationField(
            entity,
            field,
            entityModule.id,
            user
          );
        } catch (error) {
          this.logger.warn(
            `${error.message} from createEntityCustomActionsFix entityId: ${entity.id}, continue check`
          );
        }
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async createResourceCustomActions(
    resources: Resource[],
    user: User
  ): Promise<boolean> {
    let hasChanges = false;
    const promises = resources.map(async (resource) => {
      try {
        const resourceModule = await this.prisma.block.findFirst({
          where: {
            blockType: EnumBlockType.Module,
            resourceId: resource.id,
          },
        });
        if (resourceModule) return hasChanges;
        hasChanges = true;

        for (const entity of resource.entities) {
          await this.createEntityCustomActions(entity, user);
        }
      } catch (error) {
        this.logger.error(
          `Failed to run createResourceCustomActions, error: ${error} resource: ${resource.id}`
        );

        return hasChanges;
      }
    });
    await Promise.allSettled(promises);
    return hasChanges;
  }

  private async createResourceCustomDtos(
    resources: Resource[],
    user: User
  ): Promise<boolean> {
    let hasChanges = false;
    const promises = resources.map(async (resource) => {
      for (const entity of resource.entities) {
        const currentChanges = await this.createEntityCustomDtos(entity, user);
        if (!hasChanges && currentChanges) {
          hasChanges = currentChanges;
        }
      }
    });

    const settledPromises = await Promise.allSettled(promises);
    settledPromises.forEach((promise) => {
      if (promise.status === "rejected") {
        this.logger.error(
          "Failed to run createResourceCustomDtos",
          promise.reason
        );
      }
    });
    return hasChanges;
  }

  async createResourceCustomActionsFix(
    resources: Resource[],
    user: User
  ): Promise<boolean> {
    let hasChanges = false;
    const promises = resources.map(async (resource) => {
      try {
        for (const entity of resource.entities) {
          hasChanges =
            (await this.createEntityCustomActionsFix(
              entity,
              resource.id,
              user
            )) || hasChanges;
        }
      } catch (error) {
        this.logger.error(
          `Failed to run createResourceCustomActions, error: ${error} resource: ${resource.id}`
        );

        return hasChanges;
      }
    });
    await Promise.allSettled(promises);
    return hasChanges;
  }

  /**
   * workspace, project and service creation for preview account
   */

  async createPreviewEnvironment(
    account: Account
  ): Promise<PreviewAccountEnvironment> {
    const workspaceName = `Amplication-${generateRandomString()}`;
    const projectName = account.previewAccountType;

    const workspace = (await this.createPreviewWorkspace(
      {
        data: {
          name: workspaceName,
        },
        include: {
          users: {
            include: {
              account: true,
              userRoles: true,
              workspace: true,
            },
          },
        },
      },
      account.id
    )) as unknown as Workspace & { users: AuthUser[] };
    const [user] = workspace.users as AuthUser[];

    const project = await this.projectService.createProject(
      {
        data: {
          name: projectName,
          workspace: {
            connect: {
              id: workspace.id,
            },
          },
        },
      },
      user.id
    );

    let resource: Resource | undefined;

    if (
      account.previewAccountType === EnumPreviewAccountType.BreakingTheMonolith
    ) {
      resource = await this.createPreviewServiceWithPredefinedSettings(
        project.id,
        user
      );
    }

    return {
      workspace,
      project,
      resource,
    };
  }

  private async createPreviewServiceWithPredefinedSettings(
    projectId: string,
    user: User
  ): Promise<Resource> {
    const serviceName = "Monolith";
    const previewServiceSettings = this.createPreviewServiceSettings({
      projectId: projectId,
      name: serviceName,
      description: "Monolith Service",
      adminUIPath: "",
      serverPath: `./apps/${serviceName}`,
      generateAdminUI: false,
      generateGraphQL: true,
      generateRestApi: true,
    });

    const resource = await this.resourceService.createPreviewService(
      previewServiceSettings,
      user,
      [],
      false
    );

    return resource;
  }

  private createPreviewServiceSettings({
    name,
    description,
    adminUIPath,
    serverPath,
    generateAdminUI,
    generateGraphQL,
    generateRestApi,
    projectId,
  }: CreatePreviewServiceSettingsArgs): CreateOneResourceArgs {
    return {
      data: {
        name,
        description,
        resourceType: EnumResourceType.Service,
        project: {
          connect: {
            id: projectId,
          },
        },
        codeGenerator: EnumCodeGenerator.NodeJs,
        serviceSettings: {
          authProvider: EnumAuthProviderType.Jwt,
          adminUISettings: {
            adminUIPath,
            generateAdminUI,
          },
          serverSettings: {
            generateGraphQL,
            generateRestApi,
            serverPath,
          },
        },
      },
    };
  }
}
