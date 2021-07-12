import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindOneArgs } from 'src/dto';
import { Subscription } from './dto/Subscription';
import { PrismaService } from 'nestjs-prisma';
import { CreateSubscriptionInput } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async getSubscription(args: FindOneArgs): Promise<Subscription | null> {
    return this.prisma.subscription.findUnique(args);
  }

  async createSubscription(
    data: CreateSubscriptionInput
  ): Promise<Subscription> {
    return this.prisma.subscription.create({
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
    });
  }

  // async updateSubscription(): Promise<Subscription> {
  //   return this.prisma.subscription.findUnique(args);
  // }

  // async cancelSubscription(): Promise<Subscription> {
  //   return this.prisma.subscription.findUnique(args);
  // }
}
