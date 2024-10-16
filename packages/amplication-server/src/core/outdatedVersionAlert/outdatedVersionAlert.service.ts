import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { EnumOutdatedVersionAlertType, PrismaService } from "../../prisma";
import { ResourceService } from "../resource/resource.service";
import { CreateOutdatedVersionAlertArgs } from "./dto/CreateOutdatedVersionAlertArgs";
import { EnumOutdatedVersionAlertStatus } from "./dto/EnumOutdatedVersionAlertStatus";
import { FindManyOutdatedVersionAlertArgs } from "./dto/FindManyOutdatedVersionAlertArgs";
import { FindOneOutdatedVersionAlertArgs } from "./dto/FindOneOutdatedVersionAlertArgs";
import { OutdatedVersionAlert } from "./dto/OutdatedVersionAlert";
import { AmplicationError } from "../../errors/AmplicationError";
import { EnumResourceType } from "../resource/dto/EnumResourceType";

@Injectable()
export class OutdatedVersionAlertService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ResourceService))
    private readonly resourceService: ResourceService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  /**
   * create function creates a new outdatedVersionAlert for given resource in the DB
   * @returns the outdatedVersionAlert object that return after prisma.outdatedVersionAlert.create
   */
  async create(
    args: CreateOutdatedVersionAlertArgs
  ): Promise<OutdatedVersionAlert> {
    //update all previous alerts for the same resource and type that are still in status "new" to be canceled
    await this.prisma.outdatedVersionAlert.updateMany({
      where: {
        resourceId: args.data.resource.connect.id,
        type: args.data.type,
        status: EnumOutdatedVersionAlertStatus.New,
      },
      data: {
        status: EnumOutdatedVersionAlertStatus.Canceled,
      },
    });

    const outdatedVersionAlert = await this.prisma.outdatedVersionAlert.create({
      ...args,
      data: {
        ...args.data,
        status: EnumOutdatedVersionAlertStatus.New,
      },
    });

    return outdatedVersionAlert;
  }

  async resolvesServiceTemplateUpdated({
    resourceId,
  }: {
    resourceId: string;
  }): Promise<void> {
    await this.prisma.outdatedVersionAlert.updateMany({
      where: {
        resourceId: resourceId,
        type: EnumOutdatedVersionAlertType.TemplateVersion,
        status: EnumOutdatedVersionAlertStatus.New,
      },
      data: {
        status: EnumOutdatedVersionAlertStatus.Resolved,
      },
    });
  }

  async count(args: FindManyOutdatedVersionAlertArgs): Promise<number> {
    return this.prisma.outdatedVersionAlert.count(args);
  }

  async findMany(
    args: FindManyOutdatedVersionAlertArgs
  ): Promise<OutdatedVersionAlert[]> {
    return this.prisma.outdatedVersionAlert.findMany({
      where: {
        ...args.where,
        resource: {
          ...args.where?.resource,
          deletedAt: null,
          archived: { not: true },
        },
      },
    });
  }

  async findOne(
    args: FindOneOutdatedVersionAlertArgs
  ): Promise<OutdatedVersionAlert | null> {
    return this.prisma.outdatedVersionAlert.findUnique(args);
  }

  async triggerAlertsForTemplateVersion(
    templateResourceId: string,
    outdatedVersion: string,
    latestVersion: string
  ) {
    const template = await this.resourceService.resource({
      where: {
        id: templateResourceId,
      },
    });

    if (!template) {
      throw new AmplicationError(
        `Cannot trigger alerts. Template with id ${templateResourceId} not found`
      );
    }

    if (template.resourceType !== EnumResourceType.ServiceTemplate) {
      throw new AmplicationError(
        `Cannot trigger alerts. Resource with id ${templateResourceId} is not a template`
      );
    }

    //find all services using this template
    const services = await this.resourceService.resources({
      where: {
        serviceTemplateId: templateResourceId,
        project: {
          id: template.projectId,
        },
      },
    });

    if (outdatedVersion !== null) {
      //create outdatedVersionAlert for each service
      for (const service of services) {
        const currentTemplateVersion =
          await this.resourceService.getServiceTemplateSettings(
            service.id,
            null
          );

        await this.create({
          data: {
            resource: {
              connect: {
                id: service.id,
              },
            },
            type: EnumOutdatedVersionAlertType.TemplateVersion,
            outdatedVersion: currentTemplateVersion.version,
            latestVersion,
          },
        });
      }
    }
  }
}
