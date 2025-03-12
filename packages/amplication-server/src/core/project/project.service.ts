import { BillingFeature } from "@amplication/util-billing-types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import dockerNames from "docker-names";
import { isEmpty } from "lodash";
import { EntityService, ResourceService } from "../";
import { FindOneArgs } from "../../dto";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { Commit, Project, Resource, User } from "../../models";
import { EnumResourceType, PrismaService } from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { prepareDeletedItemName } from "../../util/softDelete";
import { BillingService } from "../billing/billing.service";
import { BlockPendingChange, BlockService } from "../block/block.service";
import { BuildService } from "../build/build.service";
import { EntityPendingChange } from "../entity/entity.service";
import { GitProviderService } from "../git/git.provider.service";
import { RelationService } from "../relation/relation.service";
import { RESOURCE_TYPE_GROUP_TO_RESOURCE_TYPE } from "../resource/constants";
import {
  CreateCommitArgs,
  DiscardPendingChangesArgs,
  FindPendingChangesArgs,
  PendingChange,
} from "../resource/dto";
import { EnumCommitStrategy } from "../resource/dto/EnumCommitStrategy";
import { EnumResourceTypeGroup } from "../resource/dto/EnumResourceTypeGroup";
import { ResourceVersionService } from "../resourceVersion/resourceVersion.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { ProjectCreateArgs } from "./dto/ProjectCreateArgs";
import { ProjectFindFirstArgs } from "./dto/ProjectFindFirstArgs";
import { ProjectFindManyArgs } from "./dto/ProjectFindManyArgs";
import { UpdateProjectArgs } from "./dto/UpdateProjectArgs";
import { FeatureUsageReport } from "./FeatureUsageReport";

export const INVALID_PROJECT_ID = "Invalid projectId";

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
    private readonly subscriptionService: SubscriptionService,
    private readonly logger: AmplicationLogger,
    private readonly resourceVersionService: ResourceVersionService,
    private readonly relationService: RelationService
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

      if (
        projectEntitlement &&
        (!projectEntitlement.hasAccess ||
          projectEntitlement.currentUsage >= projectEntitlement.usageLimit)
      ) {
        const message = `You have reached the maximum number of projects allowed. To continue using additional projects, please upgrade your plan.`;
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
      project.id, //use unique name for the resource to avoid conflicts with other resources in the project
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

    const { resourceTypeGroup } = args.where;

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
      this.entityService.getChangedEntities(
        projectId,
        EnumResourceTypeGroup[resourceTypeGroup],
        null,
        user.id
      ),
      this.blockService.getChangedBlocks(
        projectId,
        EnumResourceTypeGroup[resourceTypeGroup],
        null,
        user.id
      ),
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

  private async validateProjectLimitations(workspaceId, project: Project) {
    const entitiesPerServiceEntitlement =
      await this.billingService.getNumericEntitlement(
        workspaceId,
        BillingFeature.EntitiesPerService
      );
    const resourcesEntitiesCount = await this.prisma.entity.groupBy({
      by: ["resourceId"],
      where: {
        resource: {
          projectId: project.id,
          deletedAt: null,
        },
        deletedAt: null,
      },
      _count: {
        id: true,
      },
    });

    const maxResourceEntitiesCount: number = resourcesEntitiesCount.reduce(
      (max, current) => (current._count.id > max ? current._count.id : max),
      0
    );

    if (
      !entitiesPerServiceEntitlement.hasAccess ||
      (!entitiesPerServiceEntitlement.isUnlimited &&
        entitiesPerServiceEntitlement.value < maxResourceEntitiesCount)
    ) {
      const message = `Your workspace exceeds its resources entities limitation.`;
      throw new BillingLimitationError(message, BillingFeature.Services);
    }
  }

  async commit(
    args: CreateCommitArgs,
    currentUser: User
  ): Promise<Commit | null> {
    const userId = args.data.user.connect.id;
    const projectId = args.data.project.connect.id;

    const resourceTypeGroup =
      EnumResourceTypeGroup[args.data.resourceTypeGroup];

    //when committing platform resources, we commit only the resources that were selected
    //for services, all changes for all resources are committed
    const commitChangesForResourceIds =
      resourceTypeGroup === EnumResourceTypeGroup.Platform
        ? args.data.resourceIds
        : null;
    const resourceTypes =
      RESOURCE_TYPE_GROUP_TO_RESOURCE_TYPE[resourceTypeGroup];

    if (await this.shouldBlockBuild(userId)) {
      const message = "Your current plan does not allow code generation.";
      throw new BillingLimitationError(message, BillingFeature.BlockBuild);
    }

    const resources = await this.prisma.resource.findMany({
      where: {
        projectId: projectId,
        deletedAt: null,
        archived: { not: true },
        resourceType: {
          in: resourceTypes,
        },
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
    if (this.billingService.isBillingEnabled) {
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

      await this.validateProjectLimitations(project.workspaceId, project);
    }

    if (isEmpty(resources)) {
      throw new Error(`Invalid userId or resourceId`);
    }

    let changedEntities: EntityPendingChange[] = [];
    let changedBlocks: BlockPendingChange[] = [];
    [changedEntities, changedBlocks] = await Promise.all([
      this.entityService.getChangedEntities(
        projectId,
        resourceTypeGroup,
        commitChangesForResourceIds,
        userId
      ),
      this.blockService.getChangedBlocks(
        projectId,
        resourceTypeGroup,
        commitChangesForResourceIds,
        userId
      ),
    ]);

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

    let resourcesToBuild: Resource[] = resources;
    if (args.data.commitStrategy === EnumCommitStrategy.AllWithPendingChanges) {
      resourcesToBuild = resources.filter((resource) => {
        return (
          changedEntities.some(
            (change) => change.resource.id === resource.id
          ) ||
          changedBlocks.some((change) => change.resource.id === resource.id)
        );
      });
    }

    if (args.data.commitStrategy === EnumCommitStrategy.Specific) {
      if (!args.data.resourceIds || args.data.resourceIds.length === 0) {
        throw new Error(
          "resourceIds are required for specific commit strategy"
        );
      }
      resourcesToBuild = resources.filter((resource) => {
        return args.data.resourceIds.includes(resource.id);
      });
    }

    if (resourceTypeGroup === EnumResourceTypeGroup.Services) {
      const resourceIds = resourcesToBuild
        .filter(
          //filter out resources that are not services
          (resource) =>
            resource.resourceType === EnumResourceType.Service ||
            resource.resourceType === EnumResourceType.Component
        )
        .map((resource) => resource.id);

      const cascadingBuildableResourceIds =
        await this.relationService.getCascadingBuildableResourceIds(
          resourceIds
        );

      const promises = cascadingBuildableResourceIds.map(
        (resourceId: string) => {
          this.logger.debug("Creating build for resource", {
            resourceId: resourceId,
            commitStrategy: args.data.commitStrategy,
            commitId: commit.id,
          });
          return this.buildService.create({
            data: {
              resource: {
                connect: { id: resourceId },
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
        }
      );

      await Promise.all(promises);

      await this.analytics.trackWithContext({
        event: EnumEventType.CommitCreate,
        properties: {
          projectId,
        },
      });
    } else {
      //platform
      const resourceVersionPromises = resourcesToBuild.map(
        (resource: Resource) => {
          this.logger.debug("Creating version for resource", {
            resourceId: resource.id,
            commitStrategy: args.data.commitStrategy,
            commitId: commit.id,
          });
          return this.resourceVersionService.create(
            {
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
                version: args.data.resourceVersions.find(
                  (x) => x.resourceId === resource.id
                )?.version,
              },
            },
            userId
          );
        }
      );

      await Promise.all(resourceVersionPromises);

      await this.analytics.trackWithContext({
        event: EnumEventType.ResourceVersionCreate,
        properties: {
          projectId,
        },
      });
    }

    return commit;
  }

  async discardPendingChanges(
    args: DiscardPendingChangesArgs
  ): Promise<boolean | null> {
    const userId = args.data.user.connect.id;
    const projectId = args.data.project.connect.id;
    const { resourceTypeGroup } = args.data;

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
      this.entityService.getChangedEntities(
        projectId,
        EnumResourceTypeGroup[resourceTypeGroup],
        null,
        userId
      ),
      this.blockService.getChangedBlocks(
        projectId,
        EnumResourceTypeGroup[resourceTypeGroup],
        null,
        userId
      ),
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
  async createDemoRepo(projectId: string, user: User) {
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

    await this.analytics.trackManual({
      user: {
        accountId: user.account?.id,
      },
      data: {
        event: EnumEventType.DemoRepoCreate,
        properties: {
          projectId,
        },
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
