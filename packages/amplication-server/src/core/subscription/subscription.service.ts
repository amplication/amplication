import { Inject, Injectable } from "@nestjs/common";
import { Subscription } from "./dto/Subscription";
import { EnumSubscriptionPlan, EnumSubscriptionStatus } from "./dto";
import {
  PrismaService,
  Prisma,
  EnumSubscriptionStatus as PrismaEnumSubscriptionStatus,
} from "../../prisma";
import { UpsertSubscriptionInput } from "./dto/UpsertSubscriptionInput";
import { BillingService } from "../billing/billing.service";
import { UpdateStatusDto } from "./dto/UpdateStatusDto";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { BillingFeature } from "@amplication/util-billing-types";
import { EnumResourceType } from "../resource/dto/EnumResourceType";

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
    private readonly analyticsService: SegmentAnalyticsService
  ) {}

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findUnique({
      where: {
        id: id,
      },
    });
    return sub;
  }

  async getCurrentSubscription(
    workspaceId: string
  ): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findFirst({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        AND: [
          {
            workspaceId: workspaceId,
          },
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            OR: [
              {
                status: PrismaEnumSubscriptionStatus.Active,
              },
              {
                status: PrismaEnumSubscriptionStatus.Trailing,
              },
            ],
          },
          {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            OR: [
              {
                cancellationEffectiveDate: {
                  gt: new Date(),
                },
              },
              {
                cancellationEffectiveDate: null,
              },
            ],
          },
        ],
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });

    return sub;
  }

  async trackUpgradeCompletedEvent(
    plan: EnumSubscriptionPlan,
    userId: string,
    workspaceId: string
  ): Promise<void> {
    if (plan !== EnumSubscriptionPlan.Free && userId) {
      await this.analyticsService.track({
        userId: userId,
        properties: {
          workspaceId: workspaceId,
          $groups: { groupWorkspace: workspaceId },
        },
        event: EnumEventType.WorkspacePlanUpgradeCompleted,
      });
    }
  }

  async updateProjectLicensed(workspaceId: string): Promise<void> {
    if (!this.billingService.isBillingEnabled) {
      return;
    }

    const featureProjects = await this.billingService.getMeteredEntitlement(
      workspaceId,
      BillingFeature.Projects
    );

    this.logger.debug("feature projects", {
      workspaceId,
      usageLimit: featureProjects.usageLimit,
      hasAccess: featureProjects.hasAccess,
    });

    if (!featureProjects.usageLimit) {
      await this.prisma.project.updateMany({
        where: {
          workspaceId,
          deletedAt: null,
        },
        data: {
          licensed: true,
        },
      });
      return;
    }

    const projects = await this.prisma.project.findMany({
      where: {
        workspaceId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const projectsWithinLimit = projects.slice(0, featureProjects.usageLimit);
    const projectsBeyondLimit = projects.slice(featureProjects.usageLimit);

    const projectIdsWithinLimit = projectsWithinLimit.map(
      (project) => project.id
    );
    const projectIdsBeyondLimit = projectsBeyondLimit.map(
      (project) => project.id
    );

    await this.prisma.$transaction([
      this.prisma.project.updateMany({
        where: {
          id: {
            in: projectIdsWithinLimit,
          },
        },
        data: {
          licensed: true,
        },
      }),
      this.prisma.project.updateMany({
        where: {
          id: {
            in: projectIdsBeyondLimit,
          },
        },
        data: {
          licensed: false,
        },
      }),
    ]);
  }

  async updateServiceLicensed(workspaceId: string): Promise<void> {
    if (!this.billingService.isBillingEnabled) {
      return;
    }

    const featureServices = await this.billingService.getMeteredEntitlement(
      workspaceId,
      BillingFeature.Services
    );

    this.logger.debug("feature services", {
      workspaceId,
      usageLimit: featureServices.usageLimit,
      hasAccess: featureServices.hasAccess,
    });

    if (!featureServices.usageLimit) {
      await this.prisma.resource.updateMany({
        where: {
          project: {
            workspaceId,
          },
          deletedAt: null,
          archived: { not: true },
          resourceType: {
            in: [EnumResourceType.Service],
          },
        },
        data: {
          licensed: true,
        },
      });
      return;
    }

    const resources = await this.prisma.resource.findMany({
      where: {
        project: {
          workspaceId,
        },
        deletedAt: null,
        archived: { not: true },
        resourceType: {
          in: [EnumResourceType.Service],
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const resourcesWithinLimit = resources.slice(0, featureServices.usageLimit);
    const resourcesBeyondLimit = resources.slice(featureServices.usageLimit);

    const resourceIdsWithinLimit = resourcesWithinLimit.map(
      (project) => project.id
    );
    const resourceIdsBeyondLimit = resourcesBeyondLimit.map(
      (project) => project.id
    );

    await this.prisma.$transaction([
      this.prisma.resource.updateMany({
        where: {
          id: {
            in: resourceIdsWithinLimit,
          },
        },
        data: {
          licensed: true,
        },
      }),
      this.prisma.resource.updateMany({
        where: {
          id: {
            in: resourceIdsBeyondLimit,
          },
        },
        data: {
          licensed: false,
        },
      }),
    ]);
  }

  async handleUpdateSubscriptionStatusEvent(
    updateStatusDto: UpdateStatusDto
  ): Promise<void> {
    let data: UpsertSubscriptionInput;

    switch (updateStatusDto.type) {
      case "subscription.created":
      case "subscription.updated":
      case "subscription.expired":
      case "subscription.canceled": {
        data =
          this.mapUpdateStatusDtoToUpsertSubscriptionInput(updateStatusDto);

        this.logger.debug(
          "subscription created/updated/expired/canceled event emitted",
          {
            workspaceId: updateStatusDto.customer.id,
            data,
          }
        );

        await this.prisma.subscription.upsert({
          where: {
            id: updateStatusDto.id,
          },
          create: {
            id: updateStatusDto.id,
            workspaceId: data.workspaceId,
            status: data.status,
            subscriptionPlan: data.plan,
          },
          update: {
            status: data.status,
          },
        });
        break;
      }
      case "promotionalEntitlement.granted":
      case "promotionalEntitlement.updated":
      case "promotionalEntitlement.revoked":
      case "promotionalEntitlement.expired": {
        this.logger.debug("promotionalEntitlement event emitted", {
          workspaceId: updateStatusDto.customer.id,
          data: updateStatusDto,
        });

        await this.updateProjectLicensed(updateStatusDto.customer.id);
        await this.updateServiceLicensed(updateStatusDto.customer.id);
        break;
      }
    }
    if (updateStatusDto.type === "subscription.created") {
      await this.trackUpgradeCompletedEvent(
        data.plan,
        updateStatusDto.metadata?.userId,
        updateStatusDto.customer.id
      );
    }

    if (
      updateStatusDto.type === "subscription.created" ||
      updateStatusDto.type === "subscription.updated"
    ) {
      this.logger.debug("subscription created/updated event emitted", {
        workspaceId: updateStatusDto.customer.id,
        data: updateStatusDto,
      });

      await this.updateProjectLicensed(updateStatusDto.customer.id);
      await this.updateServiceLicensed(updateStatusDto.customer.id);
    }
  }

  mapUpdateStatusDtoToUpsertSubscriptionInput(
    updateStatusDto: UpdateStatusDto
  ): UpsertSubscriptionInput {
    return {
      workspaceId: updateStatusDto.customer.id,
      status: this.billingService.mapSubscriptionStatus(updateStatusDto.status),
      plan: this.billingService.mapSubscriptionPlan(updateStatusDto.plan.id),
    };
  }

  async resolveSubscription(workspaceId: string): Promise<Subscription> {
    const databaseSubscription = await this.getCurrentSubscription(workspaceId);
    if (databaseSubscription) {
      return databaseSubscription;
    }

    const stiggSubscription = await this.billingService.getSubscription(
      workspaceId
    );
    if (stiggSubscription) {
      const createSubscriptionInput: UpsertSubscriptionInput = {
        workspaceId: workspaceId,
        status: stiggSubscription.status as EnumSubscriptionStatus,
        plan: stiggSubscription.subscriptionPlan as EnumSubscriptionPlan,
      };

      const savedSubscription = await this.prisma.subscription.create({
        data: {
          id: stiggSubscription.id,
          workspaceId: createSubscriptionInput.workspaceId,
          status: createSubscriptionInput.status,
          subscriptionPlan: createSubscriptionInput.plan,
        },
      });

      return savedSubscription;
    }
    return null;
  }
}
