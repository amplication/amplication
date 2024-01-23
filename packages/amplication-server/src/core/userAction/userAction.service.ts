import { Injectable } from "@nestjs/common";
import { Prisma, PrismaService } from "../../prisma";
import { FindOneUserActionArgs } from "./dto/FindOneUserActionArgs";
import { UserAction } from "./dto";
import { EnumActionStepStatus } from "../action/dto";
import { EnumUserActionStatus, EnumUserActionType } from "./types";
import { ActionService } from "../action/action.service";

@Injectable()
export class UserActionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actionService: ActionService
  ) {}

  async findOne(args: FindOneUserActionArgs): Promise<UserAction | null> {
    return this.prisma.userAction.findUnique(args);
  }

  async createUserActionByTypeWithInitialStep(
    userActionType: EnumUserActionType,
    metadata: Record<string, any>, // provide the exact type when calling this method
    initialStepData: Prisma.ActionStepCreateWithoutActionInput,
    userId: string,
    resourceId?: string
  ): Promise<UserAction> {
    const data: Prisma.UserActionCreateInput = {
      userActionType,
      metadata,
      user: {
        connect: {
          id: userId,
        },
      },
      action: {
        create: {
          steps: {
            create: initialStepData,
          },
        },
      },
    };

    if (resourceId) {
      data.resource = {
        connect: {
          id: resourceId,
        },
      };
    }

    return await this.prisma.userAction.create({
      data,
    });
  }

  async calcUserActionStatus(
    userActionId: string
  ): Promise<EnumUserActionStatus> {
    const userAction = await this.prisma.userAction.findUnique({
      where: {
        id: userActionId,
      },
      include: {
        action: {
          include: {
            steps: true,
          },
        },
      },
    });

    if (!userAction.action?.steps?.length) return EnumUserActionStatus.Invalid;

    const steps = userAction.action.steps;

    if (steps.every((step) => step.status === EnumActionStepStatus.Success))
      return EnumUserActionStatus.Completed;

    if (steps.some((step) => step.status === EnumActionStepStatus.Failed))
      return EnumUserActionStatus.Failed;

    return EnumUserActionStatus.Running;
  }

  async updateUserActionStep(
    userActionId: string,
    actionStepName: string,
    status: EnumActionStepStatus.Success | EnumActionStepStatus.Failed
  ): Promise<UserAction> {
    const userAction = await this.prisma.userAction.findFirst({
      where: {
        id: userActionId,
      },
      include: {
        action: {
          include: {
            steps: {
              where: {
                name: actionStepName,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });

    if (!userAction) {
      throw new Error(`User action not found: ${userActionId}`);
    }

    await this.actionService.complete(userAction.action.steps[0], status);
    return userAction;
  }

  async updateUserActionMetadata(
    userActionId: string,
    metadata: any
  ): Promise<UserAction> {
    return this.prisma.userAction.update({
      where: {
        id: userActionId,
      },
      data: {
        metadata,
      },
    });
  }
}
