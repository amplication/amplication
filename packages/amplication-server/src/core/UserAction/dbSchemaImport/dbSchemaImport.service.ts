import { Injectable } from "@nestjs/common";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { DBSchemaImportRequest } from "@amplication/schema-registry";
import { User } from "../../../models";
import { PrismaService } from "../../../prisma";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../../env";
import { EntityService, UserService } from "../..";
import { EnumUserActionType } from "../types";
import { AmplicationError } from "../../../errors/AmplicationError";
import { isDBImportMetadata } from "./utils/type-guards";
import { CreateUserActionArgs, UserAction } from "../dto";
import { PROCESSING_PRISMA_SCHEMA, initialStepData } from "./constants";
import {
  ActionStep,
  EnumActionLogLevel,
  EnumActionStepStatus,
} from "../../action/dto";
import { ActionService } from "../../action/action.service";
import { ActionContext } from "../types";

@Injectable()
export class DBSchemaImportService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly entityService: EntityService,
    private readonly userService: UserService,
    private readonly actionService: ActionService
  ) {}

  async startProcessingPrismaSchema(
    file: string,
    fileName: string,
    args: CreateUserActionArgs,
    user: User
  ): Promise<UserAction> {
    const dbSchemaImportAction = await this.prisma.userAction.create({
      data: {
        userActionType: EnumUserActionType.DBSchemaImport,
        metadata: {
          schema: file,
          fileName,
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        resource: {
          connect: {
            id: args.data.resource.connect.id,
          },
        },
        action: {
          create: {
            steps: {
              create: initialStepData,
            },
          },
        },
      },
    });

    // push to kafka: actionId and file
    const prismaSchemaUploadEvent: DBSchemaImportRequest.KafkaEvent = {
      key: null,
      value: {
        actionId: dbSchemaImportAction.actionId,
        file,
      },
    };

    await this.kafkaProducerService.emitMessage(
      this.configService.get(Env.DB_SCHEMA_IMPORT_TOPIC),
      prismaSchemaUploadEvent
    );

    return dbSchemaImportAction;
  }

  async onPrismaSchemaUploadEventProcessed(
    response: DBSchemaImportRequest.Value
  ) {
    const { actionId, file } = response;
    const dbSchemaImportAction = await this.prisma.userAction.findFirst({
      where: {
        actionId,
        userActionType: EnumUserActionType.DBSchemaImport,
      },
    });

    if (!dbSchemaImportAction) {
      throw new AmplicationError(
        `Prisma schema upload action with id ${actionId} not found`
      );
    }

    const user = await this.userService.findUser({
      where: { id: dbSchemaImportAction.userId },
      include: { account: true },
    });

    if (!user) {
      throw new AmplicationError(
        `User with id ${dbSchemaImportAction.userId} not found`
      );
    }

    if (!dbSchemaImportAction.resourceId) {
      throw new AmplicationError(
        `Resource id is missing for action with id ${actionId}`
      );
    }

    if (isDBImportMetadata(dbSchemaImportAction.metadata)) {
      const step = await this.getDBSchemaImportStep(dbSchemaImportAction.id);
      const logByStep = async (level: EnumActionLogLevel, message: string) =>
        await this.actionService.logByStepId(step.id, level, message);

      const actionContext: ActionContext = {
        logByStep,
        onComplete: async (
          status: EnumActionStepStatus.Success | EnumActionStepStatus.Failed
        ) =>
          await this.completeDBSchemaImportStep(
            dbSchemaImportAction.id,
            status
          ),
      };

      await this.entityService.createEntitiesFromPrismaSchema(
        actionContext,
        file,
        dbSchemaImportAction.metadata.fileName,
        dbSchemaImportAction.resourceId,
        user
      );
    } else {
      throw new AmplicationError(
        `Metadata is not in the expected format for action with id ${actionId}`
      );
    }
  }

  async getDBSchemaImportStep(
    actionId: string
  ): Promise<ActionStep | undefined> {
    const [dbSchemaImportStep] = await this.prisma.userAction
      .findUnique({
        where: {
          id: actionId,
        },
      })
      .action()
      .steps({
        where: {
          name: PROCESSING_PRISMA_SCHEMA,
        },
      });

    return dbSchemaImportStep;
  }

  async completeDBSchemaImportStep(
    actionId: string,
    status: EnumActionStepStatus.Success | EnumActionStepStatus.Failed
  ): Promise<void> {
    const step = await this.getDBSchemaImportStep(actionId);

    if (!step) {
      throw new AmplicationError(
        `Step ${PROCESSING_PRISMA_SCHEMA} not found for action with id ${actionId}`
      );
    }

    await this.actionService.complete(step, status);
  }
}
