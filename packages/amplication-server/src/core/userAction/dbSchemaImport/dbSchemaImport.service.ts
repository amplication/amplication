import { Inject, Injectable } from "@nestjs/common";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { DBSchemaImportRequest } from "@amplication/schema-registry";
import { User } from "../../../models";
import { PrismaService } from "../../../prisma";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../../env";
import { EntityService, UserService } from "../..";
import { EnumUserActionType, ActionContext } from "../types";
import { AmplicationError } from "../../../errors/AmplicationError";
import { isDBImportMetadata } from "./utils/type-guards";
import { UserAction } from "../dto";
import { PROCESSING_PRISMA_SCHEMA, initialStepData } from "./constants";
import {
  ActionStep,
  EnumActionLogLevel,
  EnumActionStepStatus,
} from "../../action/dto";
import { ActionService } from "../../action/action.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { UserActionService } from "../userAction.service";
import { DBSchemaImportMetadata } from "./types";
import { CreateDBSchemaImportArgs } from "./dto/CreateDBSchemaImportArgs";

@Injectable()
export class DBSchemaImportService {
  constructor(
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly entityService: EntityService,
    private readonly userService: UserService,
    private readonly actionService: ActionService,
    private readonly userActionService: UserActionService
  ) {}

  async startProcessingDBSchema(
    args: CreateDBSchemaImportArgs,
    metadata: DBSchemaImportMetadata,
    user: User
  ): Promise<UserAction> {
    const dbSchemaImportAction =
      await this.userActionService.createUserActionByTypeWithInitialStep(
        EnumUserActionType.DBSchemaImport,
        metadata,
        initialStepData,
        user.id,
        args.data.resource.connect.id
      );

    const dbSchemaImportEvent: DBSchemaImportRequest.KafkaEvent = {
      key: null,
      value: {
        actionId: dbSchemaImportAction.actionId,
        file: metadata.schema,
      },
    };

    await this.kafkaProducerService.emitMessage(
      this.configService.get(Env.DB_SCHEMA_IMPORT_TOPIC),
      dbSchemaImportEvent
    );

    return dbSchemaImportAction;
  }

  async createEntitiesFromPrismaSchema(response: DBSchemaImportRequest.Value) {
    try {
      const { actionId, file } = response;
      const dbSchemaImportAction = await this.prisma.userAction.findFirst({
        where: {
          actionId,
          userActionType: EnumUserActionType.DBSchemaImport,
        },
      });

      if (!dbSchemaImportAction) {
        throw new AmplicationError(
          `Prisma schema import action with action id ${actionId} not found`
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
          `Resource id is missing for userAction action: ${dbSchemaImportAction.id}`
        );
      }

      if (isDBImportMetadata(dbSchemaImportAction.metadata)) {
        const step = await this.getDBSchemaImportStep(dbSchemaImportAction.id);

        const actionContext = this.createActionContext(
          step,
          dbSchemaImportAction.id
        );

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
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async getDBSchemaImportStep(
    userActionId: string
  ): Promise<ActionStep | undefined> {
    const [dbSchemaImportStep] = await this.prisma.userAction
      .findUnique({
        where: {
          id: userActionId,
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
    userActionId: string,
    status: EnumActionStepStatus.Success | EnumActionStepStatus.Failed
  ): Promise<void> {
    const step = await this.getDBSchemaImportStep(userActionId);

    if (!step) {
      throw new AmplicationError(
        `Step ${PROCESSING_PRISMA_SCHEMA} not found for action with id ${userActionId}`
      );
    }

    await this.actionService.complete(step, status);
  }

  /**
   * Creates an ActionContext for logByStepId and complete functions that can be invoked synchronously.
   * These functions are invoked as Promises and potential errors are immediately caught and logged.
   * This provides a means to fire-and-forget these actions without the need to await their completion.
   * The client of this ActionContext is expected to use 'void' operator while invoking these functions,
   * indicating we're not interested in their resolved value, thus handling uncaught Promise rejections.
   */
  private createActionContext(
    step: ActionStep,
    userActionId: string
  ): ActionContext {
    const logByStep = (level: EnumActionLogLevel, message: string) =>
      this.actionService.logByStepId(step.id, level, message).catch((error) =>
        this.logger.error(`Failed to log action step ${step.id}`, error, {
          stepId: step.id,
          message,
          userActionId,
        })
      );

    const onComplete = (
      status: EnumActionStepStatus.Success | EnumActionStepStatus.Failed
    ) =>
      this.completeDBSchemaImportStep(userActionId, status).catch((error) =>
        this.logger.error(`Failed to complete action step ${step.id}`, error, {
          stepId: step.id,
          userActionId,
        })
      );

    return {
      logByStep,
      onComplete,
    };
  }
}
