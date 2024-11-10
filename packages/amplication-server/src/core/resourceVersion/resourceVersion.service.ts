import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { PrismaService } from "../../prisma";
import { EntityService } from "../entity/entity.service";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { ResourceService } from "../resource/resource.service";
import { UserService } from "../user/user.service";
import { CreateResourceVersionArgs } from "./dto/CreateResourceVersionArgs";
import { FindManyResourceVersionArgs } from "./dto/FindManyResourceVersionArgs";
import { FindOneResourceVersionArgs } from "./dto/FindOneResourceVersionArgs";
import { ResourceVersion } from "./dto/ResourceVersion";
import { BlockService } from "../block/block.service";
import { compareBuild, sort, valid } from "semver";
import { OutdatedVersionAlertService } from "../outdatedVersionAlert/outdatedVersionAlert.service";
import { BlockVersion, Resource } from "../../models";
import { ResourceVersionsDiff } from "./dto/ResourceVersionsDiff";
import { ResourceVersionsDiffBlock } from "./dto/ResourceVersionsDiffBlock";
import { CompareResourceVersionsArgs } from "./dto/CompareResourceVersionsArgs";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { PrivatePluginBlockVersionSettings } from "../privatePlugin/privatePlugin.service";

@Injectable()
export class ResourceVersionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entityService: EntityService,
    private readonly blockService: BlockService,
    @Inject(forwardRef(() => ResourceService))
    private readonly resourceService: ResourceService,
    private readonly userService: UserService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly outdatedVersionAlertService: OutdatedVersionAlertService
  ) {}

  /**
   * create function creates a new resourceVersion for given resource in the DB
   * @returns the resourceVersion object that return after prisma.resourceVersion.create
   */
  async create(
    args: CreateResourceVersionArgs,
    userId: string
  ): Promise<ResourceVersion> {
    const resourceId = args.data.resource.connect.id;

    const resource = await this.resourceService.resource({
      where: { id: resourceId },
    });

    if (resource.resourceType === EnumResourceType.ServiceTemplate) {
      await this.validateVersion(args.data.version, resourceId);
    } else {
      //@todo: do we need to use real semver for plugin repo?
      const commitId = args.data.commit.connect.id;
      args.data.version = commitId.slice(commitId.length - 8);
    }

    if (
      resource.resourceType !== EnumResourceType.ServiceTemplate &&
      resource.resourceType !== EnumResourceType.PluginRepository
    ) {
      this.logger.error(
        `Resource version is supported only for service templates and plugin repository, but received resource of type ${resource.resourceType} with id ${resourceId}`
      );
      return;
    }

    const latestEntityVersions = await this.entityService.getLatestVersions({
      where: { resourceId: resourceId },
    });

    const latestBlockVersions = await this.blockService.getLatestVersions({
      where: { resourceId: resourceId },
    });

    const previousVersion = await this.getLatest(resourceId);

    const resourceVersion = await this.prisma.resourceVersion.create({
      ...args,
      data: {
        ...args.data,
        createdAt: new Date(),
        blockVersions: {
          connect: latestBlockVersions.map((version) => ({ id: version.id })),
        },
        entityVersions: {
          connect: latestEntityVersions.map((version) => ({ id: version.id })),
        },
      },
      include: {
        commit: true,
        resource: true,
      },
    });

    if (resource.resourceType === EnumResourceType.ServiceTemplate) {
      await this.outdatedVersionAlertService.triggerAlertsForTemplateVersion(
        resourceId,
        previousVersion?.version,
        args.data.version
      );
    } else if (resource.resourceType === EnumResourceType.PluginRepository) {
      await this.checkForAlertsForNewPrivatePluginVersions(
        resource,
        previousVersion?.version,
        args.data.version,
        userId
      );
    }

    return resourceVersion;
  }

  async checkForAlertsForNewPrivatePluginVersions(
    resource: Resource,
    previousVersion: string,
    newVersion: string,
    userId: string
  ) {
    const changes = await this.compareResourceVersions({
      where: {
        sourceVersion: previousVersion,
        targetVersion: newVersion,
        resource: { id: resource.id },
      },
    });

    //find all the private plugins that includes a new published version
    const changedPrivatePlugins = changes.updatedBlocks.filter(
      (block) =>
        block.targetBlockVersion.block.blockType === EnumBlockType.PrivatePlugin
    );

    for (const diff of changedPrivatePlugins) {
      const sourceSettings = diff.sourceBlockVersion
        .settings as unknown as PrivatePluginBlockVersionSettings;

      const targetSettings = diff.targetBlockVersion
        .settings as unknown as PrivatePluginBlockVersionSettings;

      //find the latest version on the target that is active and was not exist or active on the source
      const newVersions = targetSettings.versions.filter(
        (version) =>
          version.enabled &&
          !sourceSettings.versions.some(
            (sourceVersion) =>
              sourceVersion.version === version.version && sourceVersion.enabled
          )
      );

      const latestNewVersion = newVersions.reduce(
        (prev, current) =>
          !prev
            ? current
            : compareBuild(prev?.version, current.version) === -1
            ? current
            : prev,
        null
      );

      if (latestNewVersion) {
        await this.outdatedVersionAlertService.triggerAlertsForNewPluginVersion(
          resource.projectId,
          targetSettings.pluginId,
          latestNewVersion.version
        );
      }
    }
  }

  async validateVersion(version: string, resourceId): Promise<void> {
    if (!version) {
      throw new Error("Version is required");
    }

    if (!valid(version)) {
      throw new Error(`Version ${version} is not a valid semver version`);
    }

    const existingVersion = await this.prisma.resourceVersion.findFirst({
      where: {
        resourceId: resourceId,
        version: version,
      },
    });

    if (existingVersion) {
      throw new Error(
        `Version ${version} already exists for resource ${resourceId}`
      );
    }
  }

  async count(args: FindManyResourceVersionArgs): Promise<number> {
    return this.prisma.resourceVersion.count(args);
  }

  async findMany(
    args: FindManyResourceVersionArgs
  ): Promise<ResourceVersion[]> {
    return this.prisma.resourceVersion.findMany(args);
  }

  async findOne(
    args: FindOneResourceVersionArgs
  ): Promise<ResourceVersion | null> {
    return this.prisma.resourceVersion.findUnique(args);
  }

  async getLatest(resourceId: string): Promise<ResourceVersion | null> {
    return this.prisma.resourceVersion.findFirst({
      where: {
        resourceId: resourceId,
      },
      orderBy: {
        createdAt: "desc", //@todo: order by semver and consider adding status and returning the latest published version
      },
    });
  }

  async getPreviousVersion(
    resourceId: string,
    version: string
  ): Promise<ResourceVersion | null> {
    const versions = await this.prisma.resourceVersion.findMany({
      where: {
        resourceId: resourceId,
      },
      orderBy: {
        createdAt: "desc", //@todo: order by semver and consider adding status and returning the latest published version
      },
    });

    const sortedVersions = sort(versions.map((v) => v.version));

    const index = sortedVersions.indexOf(version);

    if (index === -1) {
      //not found
      return null;
    }

    if (index === 0) {
      //there is no previous version
      return null;
    }

    return versions.find((v) => v.version === sortedVersions[index - 1]);
  }

  async compareResourceVersions(
    args: CompareResourceVersionsArgs
  ): Promise<ResourceVersionsDiff> {
    const { sourceVersion, targetVersion, resource } = args.where;

    const resourceId = resource.id;

    let sourceResourceVersion;

    //when source version is not provided, we need to find the previous version based on the target version
    if (sourceVersion) {
      sourceResourceVersion = await this.prisma.resourceVersion.findFirst({
        where: {
          resourceId: resourceId,
          version: sourceVersion,
        },
      });
    } else {
      sourceResourceVersion = await this.getPreviousVersion(
        resourceId,
        targetVersion
      );
    }

    const sourceBlockVersions = sourceResourceVersion
      ? await this.blockService.getBlockVersionsByResourceVersions(
          sourceResourceVersion.id
        )
      : [];

    const targetResourceVersion = await this.prisma.resourceVersion.findFirst({
      where: {
        resourceId: resourceId,
        version: targetVersion,
      },
    });

    if (!targetResourceVersion) {
      throw new Error(
        `Resource version with version ${targetVersion} not found for resource ${resourceId}`
      );
    }

    const targetBlockVersions =
      await this.blockService.getBlockVersionsByResourceVersions(
        targetResourceVersion.id
      );

    const updated: ResourceVersionsDiffBlock[] = [];
    const deleted: BlockVersion[] = [];
    const created: BlockVersion[] = [];

    for (const sourceBlockVersion of sourceBlockVersions) {
      const targetBlockVersion = targetBlockVersions.find(
        (blockVersion) => blockVersion.block.id === sourceBlockVersion.block.id
      );

      if (targetBlockVersion) {
        if (
          sourceBlockVersion.versionNumber !== targetBlockVersion.versionNumber
        ) {
          updated.push({
            sourceBlockVersion,
            targetBlockVersion,
          });
        }
      } else {
        deleted.push(sourceBlockVersion);
      }
    }

    for (const targetBlockVersion of targetBlockVersions) {
      const sourceBlockVersion = sourceBlockVersions.find(
        (blockVersion) => blockVersion.block.id === targetBlockVersion.block.id
      );

      if (!sourceBlockVersion) {
        created.push(targetBlockVersion);
      }
    }

    return {
      updatedBlocks: updated,
      createdBlocks: created,
      deletedBlocks: deleted,
    };
  }
}
