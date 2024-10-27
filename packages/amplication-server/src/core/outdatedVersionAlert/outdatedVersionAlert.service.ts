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
import { UpdateOutdatedVersionAlertArgs } from "./dto/UpdateOutdatedVersionAlertArgs";
import { User } from "../../models";
import { PluginInstallationService } from "../pluginInstallation/pluginInstallation.service";

@Injectable()
export class OutdatedVersionAlertService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ResourceService))
    private readonly resourceService: ResourceService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly pluginInstallationService: PluginInstallationService
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
        blockId: args.data.block?.connect?.id,
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
      ...args,
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

  /**
   * Triggers alerts for all plugin installations in the given project with the given plugin id
   * when the updated plugin is a public plugin - we need to run this function for all projects (or maybe run it once without the projectId)
   *
   * @param projectId - the project id
   * @param pluginId - the plugin id e.g. "plugin-aws-s3"
   * @param newVersion - the new version of the plugin e.g. "1.0.0"
   */
  async triggerAlertsForNewPluginVersion(
    projectId: string,
    pluginId: string,
    newVersion: string
  ) {
    //get all plugin installations in the project with the pluginId
    const pluginInstallations =
      await this.pluginInstallationService.findPluginInstallationByPluginId(
        pluginId,
        {
          resource: {
            project: {
              id: projectId,
            },
          },
        }
      );

    //create outdatedVersionAlert for each service
    for (const pluginInstallation of pluginInstallations) {
      await this.create({
        data: {
          resource: {
            connect: {
              id: pluginInstallation.resourceId,
            },
          },
          block: {
            connect: {
              id: pluginInstallation.id,
            },
          },
          type: EnumOutdatedVersionAlertType.PluginVersion,
          outdatedVersion: pluginInstallation.version,
          latestVersion: newVersion,
        },
      });
    }
  }

  async update(
    args: UpdateOutdatedVersionAlertArgs,
    user: User
  ): Promise<OutdatedVersionAlert> {
    //todo: add tracking for changes (use action log?)

    return this.prisma.outdatedVersionAlert.update(args);
  }
}
