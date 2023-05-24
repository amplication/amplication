import { Inject, Injectable } from "@nestjs/common";
import { FindSubscriptionsArgs } from "./dto/FindSubscriptionsArgs";
import { Subscription } from "./dto/Subscription";
import {
  EnumSubscriptionPlan,
  EnumSubscriptionStatus,
  SubscriptionData,
} from "./dto";
import { CreateSubscriptionInput } from "./dto/CreateSubscriptionInput";
import {
  PrismaService,
  Prisma,
  EnumSubscriptionStatus as PrismaEnumSubscriptionStatus,
  Subscription as PrismaSubscription,
} from "../../prisma";
import { UpdateSubscriptionInput } from "./dto/UpdateSubscriptionInput";
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

  private async getSubscriptionByPaddleSubscriptionId(
    workspaceId: string,
    paddleSubscriptionId: string
  ): Promise<Subscription> {
    const subscriptions = await this.getSubscriptions({
      where: {
        workspace: {
          id: workspaceId,
        },
      },
    });

    return subscriptions.find((sub) => {
      return sub.subscriptionData.paddleSubscriptionId === paddleSubscriptionId;
    });
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

  async createSubscription(
    data: CreateSubscriptionInput
  ): Promise<Subscription> {
    const subscriptionToUpdate =
      await this.getSubscriptionByPaddleSubscriptionId(
        data.workspaceId,
        data.subscriptionData.paddleSubscriptionId
      );

    if (subscriptionToUpdate) {
      return this.updateSubscription(data);
    }

    return this.transformPrismaObject(
      await this.prisma.subscription.create({
        data: {
          workspace: {
            connect: {
              id: data.workspaceId,
            },
          },
          status: data.status,
          subscriptionPlan: data.plan,
          subscriptionData:
            data.subscriptionData as unknown as Prisma.InputJsonValue,
        },
      })
    );
  }

  async updateSubscription(
    data: UpdateSubscriptionInput
  ): Promise<Subscription> {
    const subscriptionToUpdate =
      await this.getSubscriptionByPaddleSubscriptionId(
        data.workspaceId,
        data.subscriptionData.paddleSubscriptionId
      );

    if (!subscriptionToUpdate) {
      throw new Error(
        `Can't find subscription to update for workspace ID ${data.workspaceId} and paddle subscription ID ${data.subscriptionData.paddleSubscriptionId}`
      );
    }

    const cancellationEffectiveDate =
      data.status === PrismaEnumSubscriptionStatus.Deleted
        ? data.subscriptionData.paddleCancellationEffectiveDate
        : null;

    return this.transformPrismaObject(
      await this.prisma.subscription.update({
        where: {
          id: subscriptionToUpdate.id,
        },
        data: {
          status: data.status,
          subscriptionPlan: data.plan,
          cancellationEffectiveDate: cancellationEffectiveDate,
          subscriptionData:
            data.subscriptionData as unknown as Prisma.InputJsonValue,
        },
      })
    );
  }

  async create(
    id: string,
    data: CreateSubscriptionInput
  ): Promise<PrismaSubscription> {
    return await this.prisma.subscription.create({
      data: {
        id: id,
        workspaceId: data.workspaceId,
        status: data.status,
        subscriptionPlan: data.plan,
        subscriptionData:
          data.subscriptionData as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async update(
    id: string,
    data: UpdateSubscriptionInput
  ): Promise<PrismaSubscription> {
    return await this.prisma.subscription.update({
      where: {
        id: id,
      },
      data: {
        status: data.status,
        subscriptionData:
          data.subscriptionData as unknown as Prisma.InputJsonValue,
      },
    });
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
    switch (updateStatusDto.type) {
      case "subscription.created": {
        const createSubscriptionInput =
          this.mapUpdateStatusDtoToCreateSubscriptionInput(updateStatusDto);
        const subs = await this.getSubscriptionById(updateStatusDto.id);
        if (subs) {
          await this.create(updateStatusDto.id, createSubscriptionInput);
          await this.trackUpgradeCompletedEvent(
            createSubscriptionInput.plan,
            updateStatusDto.metadata?.userId,
            updateStatusDto.customer.id
          );
        } else {
          this.logger.warn(
            `Trying to create an existing subscription with id: ${updateStatusDto.id}`,
            updateStatusDto
          );
        }
        break;
      }
      case "subscription.updated":
      case "subscription.expired":
      case "subscription.canceled": {
        const updateSubscriptionInput =
          this.mapUpdateStatusDtoToUpdateSubscriptionInput(updateStatusDto);
        const subs = await this.getSubscriptionById(updateStatusDto.id);
        if (subs) {
          await this.update(updateStatusDto.id, updateSubscriptionInput);
        } else {
          this.logger.warn(
            `Trying to update a non-existing subscription with id: ${updateStatusDto.id}`,
            updateStatusDto
          );
        }
        break;
      }
    }
  }

  mapUpdateStatusDtoToCreateSubscriptionInput(
    updateStatusDto: UpdateStatusDto
  ): CreateSubscriptionInput {
    return {
      workspaceId: updateStatusDto.customer.id,
      status: this.billingService.mapSubscriptionStatus(updateStatusDto.status),
      plan: this.billingService.mapSubscriptionPlan(updateStatusDto.plan.id),
      subscriptionData: new SubscriptionData(),
    };
  }

  mapUpdateStatusDtoToUpdateSubscriptionInput(
    updateStatusDto: UpdateStatusDto
  ): UpdateSubscriptionInput {
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
      const createSubscriptionInput: CreateSubscriptionInput = {
        workspaceId: workspaceId,
        status: stiggSubscription.status as EnumSubscriptionStatus,
        plan: stiggSubscription.subscriptionPlan as EnumSubscriptionPlan,
        subscriptionData: new SubscriptionData(),
      };

      const savedSubscription = await this.create(
        stiggSubscription.id,
        createSubscriptionInput
      );
      const mappedSubscription = {
        ...savedSubscription,
        subscriptionData: null,
      };
      return mappedSubscription;
    }
    return null;
  }
}
