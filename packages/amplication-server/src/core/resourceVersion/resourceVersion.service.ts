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
import { valid } from "semver";
import { OutdatedVersionAlertService } from "../outdatedVersionAlert/outdatedVersionAlert.service";
import { Block } from "../../models";
import { ResourceVersionsDiff } from "./dto/ResourceVersionsDiff";
import { ResourceVersionsDiffBlock } from "./dto/ResourceVersionsDiffBlock";
import { CompareResourceVersionsArgs } from "./dto/CompareResourceVersionsArgs";

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
  async create(args: CreateResourceVersionArgs): Promise<ResourceVersion> {
    const resourceId = args.data.resource.connect.id;

    await this.validateVersion(args.data.version, resourceId);

    const resource = await this.resourceService.findOne({
      where: { id: resourceId },
    });

    if (resource.resourceType !== EnumResourceType.ServiceTemplate) {
      this.logger.error(
        `Resource version is supported only for service templates, but received resource of type ${resource.resourceType} with id ${resourceId}`
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

    await this.outdatedVersionAlertService.triggerAlertsForTemplateVersion(
      resourceId,
      previousVersion.version,
      args.data.version
    );

    return resourceVersion;
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

  async compareResourceVersions(
    args: CompareResourceVersionsArgs
  ): Promise<ResourceVersionsDiff> {
    const { sourceVersion, targetVersion, resource } = args.where;

    const resourceId = resource.id;

    const sourceResourceVersion = await this.prisma.resourceVersion.findFirst({
      where: {
        resourceId: resourceId,
        version: sourceVersion,
      },
    });

    const sourceBlocks = await this.blockService.getBlocksByResourceVersions(
      sourceResourceVersion.id
    );

    const targetResourceVersion = await this.prisma.resourceVersion.findFirst({
      where: {
        resourceId: resourceId,
        version: targetVersion,
      },
    });

    const targetBlocks = await this.blockService.getBlocksByResourceVersions(
      targetResourceVersion.id
    );

    const updated: ResourceVersionsDiffBlock[] = [];
    const deleted: Block[] = [];
    const created: Block[] = [];

    for (const sourceBlock of sourceBlocks) {
      const targetBlock = targetBlocks.find(
        (block) => block.id === sourceBlock.id
      );

      if (targetBlock) {
        if (sourceBlock.versionNumber !== targetBlock.versionNumber) {
          updated.push({
            sourceBlock,
            targetBlock,
          });
        }
      } else {
        deleted.push(sourceBlock);
      }
    }

    for (const targetBlock of targetBlocks) {
      const sourceBlock = sourceBlocks.find(
        (block) => block.id === targetBlock.id
      );

      if (!sourceBlock) {
        created.push(targetBlock);
      }
    }

    return {
      updatedBlocks: updated,
      createdBlocks: created,
      deletedBlocks: deleted,
    };
  }
}
