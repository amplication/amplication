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
    private readonly logger: AmplicationLogger
  ) {}

  /**
   * create function creates a new resourceVersion for given resource in the DB
   * @returns the resourceVersion object that return after prisma.resourceVersion.create
   */
  async create(args: CreateResourceVersionArgs): Promise<ResourceVersion> {
    const resourceId = args.data.resource.connect.id;
    const user = await this.userService.findUser({
      where: {
        id: args.data.createdBy.connect.id,
      },
    });

    const commitId = args.data.commit.connect.id;

    /**@todo: set version based on semver and latest version */
    const version = commitId.slice(commitId.length - 8);

    const latestEntityVersions = await this.entityService.getLatestVersions({
      where: { resourceId: resourceId },
    });

    const latestBlockVersions = await this.blockService.getLatestVersions({
      where: { resourceId: resourceId },
    });

    const resourceVersion = await this.prisma.resourceVersion.create({
      ...args,
      data: {
        ...args.data,
        version,
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

    const resource = await this.resourceService.findOne({
      where: { id: resourceId },
    });
    if (resource.resourceType !== EnumResourceType.ServiceTemplate) {
      logger.info("Resource version is supported only for service templates");
      return;
    }

    return resourceVersion;
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
}
