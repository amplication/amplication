import { Inject, Injectable } from "@nestjs/common";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import {
  DBSchemaImportRequest,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { User } from "../../models";
import { PrismaService } from "../../prisma";
import { ConfigService } from "@nestjs/config";
import { EntityService, UserService } from "..";
import { EnumUserActionType } from "../userAction/types";
import { AmplicationError } from "../../errors/AmplicationError";
import { isDBImportMetadata } from "./utils/type-guards";
import { UserAction } from "../userAction/dto";
import { PROCESSING_PRISMA_SCHEMA, initialStepData } from "./constants";
import { ActionStep } from "../action/dto";
import { ActionService } from "../action/action.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { UserActionService } from "../userAction/userAction.service";
import { DBSchemaImportMetadata } from "./types";
import { CreateDBSchemaImportArgs } from "./dto/CreateDBSchemaImportArgs";
import { EnumSchemaNames } from "./dto/EnumSchemaNames";
import { calDotComPredefinedSchema } from "./predefinedSchemes/calDotCom/calDotCom";

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
      KAFKA_TOPICS.DB_SCHEMA_IMPORT_TOPIC,
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
        const actionContext = this.actionService.createActionContext(
          dbSchemaImportAction.id,
          step,
          KAFKA_TOPICS.USER_ACTION_LOG_TOPIC
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

  async getPredefinedSchema(schemaNames: EnumSchemaNames): Promise<string> {
    switch (schemaNames) {
      case EnumSchemaNames.CalDotCom:
        return calDotComPredefinedSchema;
      default:
        throw new Error(`Schema name ${schemaNames} is not supported`);
    }
  }
}
