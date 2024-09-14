import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { BillingService } from "../billing/billing.service";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { ResourceService } from "./resource.service";
import { Resource, User } from "../../models";
import { EnumResourceType } from "./dto/EnumResourceType";
import { CreateServiceTemplateArgs } from "./dto/CreateServiceTemplateArgs";
import { FindManyResourceArgs } from "./dto";

@Injectable()
export class ServiceTemplateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
    private readonly analyticsService: SegmentAnalyticsService,
    private readonly serviceSettingsService: ServiceSettingsService,
    private readonly logger: AmplicationLogger,
    private readonly resourceService: ResourceService
  ) {}

  /**
   * Create a resource of type "Service Template"
   */
  async createServiceTemplate(
    args: CreateServiceTemplateArgs,
    user: User
  ): Promise<Resource> {
    const { serviceSettings, ...rest } = args.data.resource;

    const resource = await this.resourceService.createResource(
      {
        data: {
          ...rest,
          resourceType: EnumResourceType.ServiceTemplate,
        },
      },
      user
    );

    await this.resourceService.createServiceDefaultObjects(
      resource,
      user,
      false,
      serviceSettings
    );

    if (args.data.plugins?.plugins) {
      await this.resourceService.installPlugins(
        resource.id,
        args.data.plugins.plugins,
        user
      );
    }

    return resource;
  }

  async serviceTemplates(args: FindManyResourceArgs): Promise<Resource[]> {
    return this.resourceService.resources({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
        archived: { not: true },
        resourceType: {
          equals: EnumResourceType.ServiceTemplate,
        },
      },
    });
  }
}
