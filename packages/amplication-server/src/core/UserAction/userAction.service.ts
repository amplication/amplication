import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma";
import { FindOneUserActionArgs } from "./dto/FindOneUserActionArgs";
import { UserAction } from "./dto";
import { EnumActionStepStatus } from "../action/dto";
import { EnumUserActionStatus } from "./types";

@Injectable()
export class UserActionService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(args: FindOneUserActionArgs): Promise<UserAction | null> {
    return this.prisma.userAction.findUnique(args);
  }

  async calcUserActionStatus(userActionId) {
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
}
