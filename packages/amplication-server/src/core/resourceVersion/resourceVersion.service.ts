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

    const user = await this.userService.findUser({
      where: {
        id: args.data.createdBy.connect.id,
      },
    });

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

    const logger = this.logger.child({
      resourceVersionId: resourceVersion.id,
      resourceId: resourceVersion.resourceId,
      userId: resourceVersion.userId,
      user,
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
}
