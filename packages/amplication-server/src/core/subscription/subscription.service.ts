import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindSubscriptionsArgs } from './dto/FindSubscriptionsArgs';
import { Subscription } from './dto/Subscription';
import { SubscriptionData } from './dto';
import { CreateSubscriptionInput } from './dto/CreateSubscriptionInput';
import {
  EnumSubscriptionStatus,
  Prisma,
  PrismaService,
  Subscription as PrismaSubscription
} from '@amplication/prisma-db';
import { UpdateSubscriptionInput } from './dto/UpdateSubscriptionInput';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private async getSubscriptions(
    args: FindSubscriptionsArgs
  ): Promise<Subscription[] | null> {
    const subs = await this.prisma.subscription.findMany(args);

    return subs.map(sub => {
      return this.transformPrismaObject(sub);
    });
  }

  async getCurrentSubscription(
    workspaceId: string
  ): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findFirst({
      where: {
        workspaceId: workspaceId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR: [
          {
            cancellationEffectiveDate: {
              gt: new Date()
            }
          },
          {
            cancellationEffectiveDate: null
          }
        ]
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc
      }
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
          id: workspaceId
        }
      }
    });

    return subscriptions.find(sub => {
      return sub.subscriptionData.paddleSubscriptionId === paddleSubscriptionId;
    });
  }

  private transformPrismaObject(
    subscription: PrismaSubscription | null
  ): Subscription | null {
    if (!subscription) return null;
    const data = (subscription.subscriptionData as unknown) as SubscriptionData;

    return {
      ...subscription,
      cancelUrl: data.paddleCancelUrl,
      updateUrl: data.paddleUpdateUrl,
      nextBillDate: data.paddleNextBillDate
        ? new Date(data.paddleNextBillDate)
        : null,
      price: data.paddleUnitPrice,
      subscriptionData: data
    };
  }

  async createSubscription(
    data: CreateSubscriptionInput
  ): Promise<Subscription> {
    const subscriptionToUpdate = await this.getSubscriptionByPaddleSubscriptionId(
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
              id: data.workspaceId
            }
          },
          status: data.status,
          subscriptionPlan: data.plan,
          subscriptionData: (data.subscriptionData as unknown) as Prisma.InputJsonValue
        }
      })
    );
  }

  async updateSubscription(
    data: UpdateSubscriptionInput
  ): Promise<Subscription> {
    const subscriptionToUpdate = await this.getSubscriptionByPaddleSubscriptionId(
      data.workspaceId,
      data.subscriptionData.paddleSubscriptionId
    );

    if (!subscriptionToUpdate) {
      throw new Error(
        `Can't find subscription to update for workspace ID ${data.workspaceId} and paddle subscription ID ${data.subscriptionData.paddleSubscriptionId}`
      );
    }

    const cancellationEffectiveDate =
      data.status === EnumSubscriptionStatus.Deleted
        ? data.subscriptionData.paddleCancellationEffectiveDate
        : null;

    return this.transformPrismaObject(
      await this.prisma.subscription.update({
        where: {
          id: subscriptionToUpdate.id
        },
        data: {
          status: data.status,
          subscriptionPlan: data.plan,
          cancellationEffectiveDate: cancellationEffectiveDate,
          subscriptionData: (data.subscriptionData as unknown) as Prisma.InputJsonValue
        }
      })
    );
  }
}
