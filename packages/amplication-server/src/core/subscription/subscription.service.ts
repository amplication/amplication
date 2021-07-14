import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindSubscriptionsArgs } from './dto/FindSubscriptionsArgs';
import { Subscription } from './dto/Subscription';
import { PrismaService } from 'nestjs-prisma';
import { SubscriptionData } from './dto';
import { CreateSubscriptionInput } from './dto/CreateSubscriptionInput';
import { Prisma, Subscription as PrismaSubscription } from '@prisma/client';

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

  private transformPrismaObject(
    subscription: PrismaSubscription | null
  ): Subscription | null {
    if (!subscription) return null;
    const data = (subscription.subscriptionData as unknown) as SubscriptionData;

    return {
      ...subscription,
      cancelUrl: data.paddleCancelUrl,
      updateUrl: data.paddleUpdateUrl,
      nextBillDate: data.paddleNextBillDate,
      price: data.paddleUnitPrice,
      subscriptionData: data
    };
  }

  async createSubscription(
    data: CreateSubscriptionInput
  ): Promise<Subscription> {
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

  // async updateSubscription(): Promise<Subscription> {
  //   return this.prisma.subscription.findUnique(args);
  // }

  // async cancelSubscription(): Promise<Subscription> {
  //   return this.prisma.subscription.findUnique(args);
  // }
}
