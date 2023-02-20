import { Injectable } from "@nestjs/common";
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

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billingService: BillingService
  ) {}

  private async getSubscriptions(
    args: FindSubscriptionsArgs
  ): Promise<Subscription[] | null> {
    const subs = await this.prisma.subscription.findMany(args);

    return subs.map((sub) => {
      return this.transformPrismaObject(sub);
    });
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
