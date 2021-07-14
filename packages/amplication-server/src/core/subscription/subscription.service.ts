import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindSubscriptionsArgs } from './dto/FindSubscriptionsArgs';
import { Subscription } from './dto/Subscription';
import { PrismaService } from 'nestjs-prisma';
import { SubscriptionData } from './dto';
import { CreateSubscriptionInput } from './dto/CreateSubscriptionInput';
import { Prisma, Subscription as PrismaSubscription } from '@prisma/client';
import { UpdateSubscriptionInput } from './dto/UpdateSubscriptionInput';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async getSubscription(
    args: FindSubscriptionsArgs
  ): Promise<Subscription[] | null> {
    const subs = await this.prisma.subscription.findMany(args);

    return subs.map(sub => {
      return this.transformPrismaObject(sub);
    });
  }

  private async getSubscriptionByPaddleSubscriptionId(
    workspaceId: string,
    paddleSubscriptionId: string
  ): Promise<Subscription> {
    const subscriptions = await this.getSubscription({
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
      nextBillDate: new Date(data.paddleNextBillDate),
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

    return this.transformPrismaObject(
      await this.prisma.subscription.update({
        where: {
          id: subscriptionToUpdate.id
        },
        data: {
          status: data.status,
          subscriptionPlan: data.plan,
          subscriptionData: (data.subscriptionData as unknown) as Prisma.InputJsonValue
        }
      })
    );
  }
}
