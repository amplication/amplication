import { PrismaService, EnumResourceType } from "../../prisma";
import { Injectable } from "@nestjs/common";
import { FindOneArgs } from "../../dto";
import { Commit, Project, Resource, User } from "../../models";
import { prepareDeletedItemName } from "../../util/softDelete";
import { ResourceService, EntityService } from "../";
import { BlockPendingChange, BlockService } from "../block/block.service";
import { BuildService } from "../build/build.service";
import {
  CreateCommitArgs,
  DiscardPendingChangesArgs,
  FindPendingChangesArgs,
  PendingChange,
} from "../resource/dto";
import { ProjectCreateArgs } from "./dto/ProjectCreateArgs";
import { ProjectFindFirstArgs } from "./dto/ProjectFindFirstArgs";
import { ProjectFindManyArgs } from "./dto/ProjectFindManyArgs";
import { isEmpty } from "lodash";
import { UpdateProjectArgs } from "./dto/UpdateProjectArgs";
import { BillingService } from "../billing/billing.service";
import { FeatureUsageReport } from "./FeatureUsageReport";
import { BillingFeature } from "@amplication/util-billing-types";
import { GitProviderService } from "../git/git.provider.service";

export const INVALID_PROJECT_ID = "Invalid projectId";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import dockerNames from "docker-names";
import { EntityPendingChange } from "../entity/entity.service";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { SubscriptionService } from "../subscription/subscription.service";

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resourceService: ResourceService,
    private readonly blockService: BlockService,
    private readonly buildService: BuildService,
    private readonly entityService: EntityService,
    private readonly billingService: BillingService,
    private readonly analytics: SegmentAnalyticsService,
    private readonly gitProviderService: GitProviderService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  async findProjects(args: ProjectFindManyArgs): Promise<Project[]> {
    return this.prisma.project.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  }

  async findUnique(args: FindOneArgs): Promise<Project> {
    return this.prisma.project.findUnique(args);
  }

  async findFirst(args: ProjectFindFirstArgs): Promise<Project> {
    return this.prisma.project.findFirst(args);
  }

  async createProject(
    args: ProjectCreateArgs,
    userId: string
  ): Promise<Project> {
    if (this.billingService.isBillingEnabled) {
      const projectEntitlement =
        await this.billingService.getMeteredEntitlement(
          args.data.workspace.connect.id,
          BillingFeature.Projects
        );

      if (projectEntitlement && !projectEntitlement.hasAccess) {
        const message = `Your workspace exceeds its project limitation.`;
        throw new BillingLimitationError(message, BillingFeature.Projects);
      }
    }

    const project = await this.prisma.project.create({
      data: {
        ...args.data,
        workspace: {
          connect: {
            id: args.data.workspace.connect.id,
          },
        },
      },
    });

    await this.resourceService.createProjectConfiguration(
      project.id,
      project?.name,
      userId
    );

    await this.billingService.reportUsage(
      project.workspaceId,
      BillingFeature.Projects
    );

    return project;
  }

  async deleteProject(args: FindOneArgs): Promise<Project> {
    const project = await this.findFirst({
      where: { id: args.where.id, deletedAt: null },
      include: { workspace: true },
    } as ProjectFindFirstArgs);

    if (isEmpty(project)) {
      throw new Error(INVALID_PROJECT_ID);
    }

    const archivedResources =
      await this.resourceService.archiveProjectResources(project.id);
    const archivedServiceCount = archivedResources.filter(
      (r) => r.resourceType === EnumResourceType.Service
    ).length;

    await this.billingService.reportUsage(
      project.workspace.id,
      BillingFeature.Services,
      -archivedServiceCount
    );

    const updatedProject = this.prisma.project.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(project.name, project.id),
        deletedAt: new Date(),
      },
    });

    await this.billingService.reportUsage(
      project.workspaceId,
      BillingFeature.Projects,
      -1
    );

    await this.subscriptionService.updateProjectLicensed(project.workspaceId);
    await this.subscriptionService.updateServiceLicensed(project.workspaceId);

    return updatedProject;
  }

  async updateProject(args: UpdateProjectArgs): Promise<Project> {
    return this.prisma.project.update({
      where: { ...args.where },
      data: {
        ...args.data,
      },
    });
  }

  /**
   * Gets all the origins changed since the last commit in the resource
   */
  async getPendingChanges(
    args: FindPendingChangesArgs,
    user: User
  ): Promise<PendingChange[]> {
    const projectId = args.where.project.id;

    const resource = await this.prisma.resource.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        archived: { not: true },
        project: {
          workspace: {
            users: {
              some: {
                id: user.id,
              },
            },
          },
        },
      },
    });

    if (isEmpty(resource)) {
      throw new Error(`Invalid userId or projectId`);
    }

    const [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(projectId, user.id),
      this.blockService.getChangedBlocks(projectId, user.id),
    ]);

    return [...changedEntities, ...changedBlocks];
  }

  async calculateMeteredUsage(
    workspaceId: string
  ): Promise<FeatureUsageReport> {
    const entitiesPerServiceEntitlement =
      await this.billingService.getNumericEntitlement(
        workspaceId,
        BillingFeature.EntitiesPerService
      );

    const entitiesPerService = entitiesPerServiceEntitlement.value;

    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        subscriptions: true,
        users: {
          where: {
            deletedAt: null,
          },
        },
        projects: {
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
          where: {
            deletedAt: null,
          },
        },
      },
    });

    const workspaceServices = workspace.projects.flatMap(
      (project) => project.resources
    );

    let servicesAboveEntityPerServiceLimitCount = 0;
    if (entitiesPerService) {
      const servicesAboveEntityPerServiceLimit = workspaceServices.filter(
        (service) => service.entities.length > entitiesPerService
      );
      servicesAboveEntityPerServiceLimitCount =
        servicesAboveEntityPerServiceLimit.length;
    }

    return {
      projects: workspace.projects.length,
      services: workspaceServices.length,
      servicesAboveEntityPerServiceLimit:
        servicesAboveEntityPerServiceLimitCount,
      teamMembers: workspace.users.length,
    };
  }

  private async shouldBlockBuild(userId: string): Promise<boolean> {
    if (!this.billingService.isBillingEnabled) {
      return false;
    }

    const workspace = await this.prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .workspace();

    const blockBuildEntitlement =
      await this.billingService.getBooleanEntitlement(
        workspace.id,
        BillingFeature.BlockBuild
      );

    return blockBuildEntitlement.hasAccess;
  }

  async commit(
    args: CreateCommitArgs,
    currentUser: User,
    skipBuild = false
  ): Promise<Commit | null> {
    const userId = args.data.user.connect.id;
    const projectId = args.data.project.connect.id;

    if (await this.shouldBlockBuild(userId)) {
      const message = "Your current plan does not allow code generation.";
      throw new BillingLimitationError(message, BillingFeature.BlockBuild);
    }

    const resources = await this.prisma.resource.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        archived: { not: true },
        project: {
          workspace: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
    });
    const project = await this.findFirst({ where: { id: projectId } });

    //check if billing enabled first to skip calculation
    if (this.billingService.isBillingEnabled && !skipBuild) {
      const usageReport = await this.calculateMeteredUsage(project.workspaceId);
      await this.billingService.resetUsage(project.workspaceId, usageReport);

      const projects = await this.prisma.project.findMany({
        where: {
          workspaceId: project.workspaceId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const repositories =
        await this.gitProviderService.getProjectsConnectedGitRepositories([
          project.id,
        ]);

      await this.billingService.validateSubscriptionPlanLimitationsForWorkspace(
        {
          workspaceId: project.workspaceId,
          currentUser,
          currentProjectId: project.id,
          projects: projects,
          repositories,
          bypassLimitations: args.data.bypassLimitations,
        }
      );
    }

    if (isEmpty(resources)) {
      throw new Error(`Invalid userId or resourceId`);
    }

    let changedEntities: EntityPendingChange[] = [];
    let changedBlocks: BlockPendingChange[] = [];
    if (skipBuild) {
      changedBlocks =
        await this.blockService.getChangedBlocksForCustomActionsMigration(
          projectId,
          userId
        );
    } else {
      [changedEntities, changedBlocks] = await Promise.all([
        this.entityService.getChangedEntities(projectId, userId),
        this.blockService.getChangedBlocks(projectId, userId),
      ]);
    }

    /**@todo: consider discarding locked objects that have no actual changes */

    const commit = await this.prisma.commit.create({
      data: {
        message: args.data.message,
        project: {
          connect: {
            id: projectId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await this.billingService.reportUsage(
      project.workspaceId,
      BillingFeature.CodeGenerationBuilds
    );

    await Promise.all(
      changedEntities.flatMap((change) => {
        const versionPromise = this.entityService.createVersion({
          data: {
            commit: {
              connect: {
                id: commit.id,
              },
            },
            entity: {
              connect: {
                id: change.originId,
              },
            },
          },
        });

        const releasePromise = this.entityService.releaseLock(change.originId);

        return [
          versionPromise.then(() => null),
          releasePromise.then(() => null),
        ];
      })
    );

    await Promise.all(
      changedBlocks.flatMap((change) => {
        const versionPromise = this.blockService.createVersion({
          data: {
            commit: {
              connect: {
                id: commit.id,
              },
            },
            block: {
              connect: {
                id: change.originId,
              },
            },
          },
        });

        const releasePromise = this.blockService.releaseLock(change.originId);

        return [
          versionPromise.then(() => null),
          releasePromise.then(() => null),
        ];
      })
    );

    /**@todo: use a transaction for all data updates  */
    //await this.prisma.$transaction(allPromises);

    if (!skipBuild) {
      const promises = resources
        .filter(
          (res) => res.resourceType !== EnumResourceType.ProjectConfiguration
        )
        .map((resource: Resource) => {
          return this.buildService.create({
            data: {
              resource: {
                connect: { id: resource.id },
              },
              commit: {
                connect: {
                  id: commit.id,
                },
              },
              createdBy: {
                connect: {
                  id: userId,
                },
              },
              message: args.data.message,
            },
          });
        });

      await Promise.all(promises);
    }
    if (!skipBuild) {
      await this.analytics.track({
        userId: currentUser.account.id,
        properties: {
          workspaceId: project.workspaceId,
          projectId: project.id,
          $groups: { groupWorkspace: project.workspaceId },
        },
        event: EnumEventType.CommitCreate,
      });
    }

    return commit;
  }

  async discardPendingChanges(
    args: DiscardPendingChangesArgs
  ): Promise<boolean | null> {
    const userId = args.data.user.connect.id;
    const projectId = args.data.project.connect.id;

    const resource = await this.prisma.resource.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        archived: { not: true },
        project: {
          workspace: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
    });

    if (isEmpty(resource)) {
      throw new Error(`Invalid userId or resourceId`);
    }

    const [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(projectId, userId),
      this.blockService.getChangedBlocks(projectId, userId),
    ]);

    if (isEmpty(changedEntities) && isEmpty(changedBlocks)) {
      throw new Error(
        `There are no pending changes for user ${userId} in resource ${projectId}`
      );
    }

    const currentUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const entityPromises = changedEntities.map((change) => {
      return this.entityService.discardPendingChanges(change, currentUser);
    });

    const blockPromises = changedBlocks.map((change) => {
      return this.blockService.discardPendingChanges(change, currentUser);
    });

    await Promise.all(blockPromises);
    await Promise.all(entityPromises);

    /**@todo: use a transaction for all data updates  */
    //await this.prisma.$transaction(allPromises);

    return true;
  }

  /**
   * Creates a demo repository for a project
   */
  async createDemoRepo(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (project.useDemoRepo) {
      throw Error("Demo repo already created for this project");
    }

    const projectResources = await this.prisma.resource.findMany({
      where: {
        projectId: projectId,
      },
    });

    if (projectResources.length > 1) {
      //single resource of type project configuration is expected
      throw Error("Cannot use demo repo on existing project");
    }

    const demoRepoName = await this.getUniqueNameForDemoRepo(projectId);

    await this.gitProviderService.createDemoRepository(demoRepoName);

    await this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        useDemoRepo: true,
        demoRepoName: demoRepoName,
      },
    });
  }

  /**
   * Find a unique name for a demo repo.
   * In case of no unique name was find after 3 retires, returns the default name
   * @param defaultUniqueName
   * @returns
   */
  async getUniqueNameForDemoRepo(defaultUniqueName: string): Promise<string> {
    let i = 0;
    let repoNameAvailable = false;
    let demoRepoName = "";
    while (i < 3 && !repoNameAvailable) {
      demoRepoName = dockerNames.getRandomName(true);

      repoNameAvailable =
        (await this.prisma.project.count({
          where: { demoRepoName: demoRepoName },
        })) === 0;

      i++;
    }
    if (!repoNameAvailable) {
      return defaultUniqueName;
    }
    return demoRepoName;
  }

  async disableDemoRepoForAllWorkspaceProjects(workspaceId: string) {
    await this.prisma.project.updateMany({
      where: {
        workspaceId: workspaceId,
      },
      data: {
        useDemoRepo: false,
      },
    });
  }
}
