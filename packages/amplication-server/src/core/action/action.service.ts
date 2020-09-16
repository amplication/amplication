import { Injectable } from '@nestjs/common';

import { PrismaService } from 'nestjs-prisma';
import { FindOneActionArgs } from './dto/FindOneActionArgs';
import { Action } from './dto/Action';
import { ActionStep } from './dto/ActionStep';
import { SortOrder } from '@prisma/client';

@Injectable()
export class ActionService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(args: FindOneActionArgs): Promise<Action | null> {
    return this.prisma.action.findOne(args);
  }

  async getSteps(actionId: string): Promise<ActionStep[]> {
    return this.prisma.actionStep.findMany({
      where: {
        actionId: actionId
      },
      orderBy: {
        createdAt: SortOrder.asc
      },
      include: {
        logs: {
          orderBy: {
            createdAt: SortOrder.asc
          }
        }
      }
    });
  }
}
