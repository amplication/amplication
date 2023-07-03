import { Inject, Injectable } from "@nestjs/common";
import { FindSubscriptionsArgs } from "./dto/FindSubscriptionsArgs";
import { Subscription } from "./dto/Subscription";
import {
  EnumSubscriptionPlan,
  EnumSubscriptionStatus,
  SubscriptionData,
} from "./dto";
import {
  PrismaService,
  Prisma,
  EnumSubscriptionStatus as PrismaEnumSubscriptionStatus,
  Subscription as PrismaSubscription,
} from "../../prisma";
import { UpsertSubscriptionInput } from "./dto/UpsertSubscriptionInput";
import { BillingService } from "../billing/billing.service";
import { UpdateStatusDto } from "./dto/UpdateStatusDto";
import {
  EnumEventType,
  SegmentAnalyticsService,
} from "../../services/segmentAnalytics/segmentAnalytics.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService,
    private readonly analyticsService: SegmentAnalyticsService
  ) {}

  private async getSubscriptions(
    args: FindSubscriptionsArgs
  ): Promise<Subscription[] | null> {
    const subs = await this.prisma.subscription.findMany(args);

    return subs.map((sub) => {
      return this.transformPrismaObject(sub);
    });
  }

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findUnique({
      where: {
        id: id,
      },
    });
    return this.transformPrismaObject(sub);
  }

  async getCurrentSubscription(
    workspaceId: string
  ): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findFirst({
      where: {
        workspaceId: workspaceId,
        status: PrismaEnumSubscriptionStatus.Active,
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
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });

    return this.transformPrismaObject(sub);
  }

  private transformPrismaObject(
    subscription: PrismaSubscription | null
  ): Subscription | null {
    if (!subscription) return null;
    const data = subscription.subscriptionData as unknown as SubscriptionData;

    return {
      ...subscription,
      cancelUrl: data.paddleCancelUrl,
      updateUrl: data.paddleUpdateUrl,
      nextBillDate: data.paddleNextBillDate
        ? new Date(data.paddleNextBillDate)
        : null,
      price: data.paddleUnitPrice,
      subscriptionData: data,
    };
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
        },
        event: EnumEventType.WorkspacePlanUpgradeCompleted,
      });
    }
  }

  async handleUpdateSubscriptionStatusEvent(
    updateStatusDto: UpdateStatusDto
  ): Promise<void> {
    const data =
      this.mapUpdateStatusDtoToUpsertSubscriptionInput(updateStatusDto);

    switch (updateStatusDto.type) {
      case "subscription.created":
      case "subscription.updated":
      case "subscription.expired":
      case "subscription.canceled": {
        await this.prisma.subscription.upsert({
          where: {
            id: updateStatusDto.id,
          },
          create: {
            id: updateStatusDto.id,
            workspaceId: data.workspaceId,
            status: data.status,
            subscriptionPlan: data.plan,
            subscriptionData:
              data.subscriptionData as unknown as Prisma.InputJsonValue,
          },
          update: {
            status: data.status,
            subscriptionData:
              data.subscriptionData as unknown as Prisma.InputJsonValue,
          },
        });
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
  }

  mapUpdateStatusDtoToUpsertSubscriptionInput(
    updateStatusDto: UpdateStatusDto
  ): UpsertSubscriptionInput {
    return {
      workspaceId: updateStatusDto.customer.id,
      status: this.billingService.mapSubscriptionStatus(updateStatusDto.status),
      plan: this.billingService.mapSubscriptionPlan(updateStatusDto.plan.id),
      subscriptionData: new SubscriptionData(),
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
        subscriptionData: new SubscriptionData(),
      };

      const savedSubscription = await this.prisma.subscription.create({
        data: {
          id: stiggSubscription.id,
          workspaceId: createSubscriptionInput.workspaceId,
          status: createSubscriptionInput.status,
          subscriptionPlan: createSubscriptionInput.plan,
          subscriptionData:
            createSubscriptionInput.subscriptionData as unknown as Prisma.InputJsonValue,
        },
      });

      const mappedSubscription = {
        ...savedSubscription,
        subscriptionData: null,
      };
      return mappedSubscription;
    }
    return null;
  }
}
