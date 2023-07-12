import { Injectable } from "@nestjs/common";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { DBSchemaImportRequest } from "@amplication/schema-registry";
import { User } from "../../../models";
import { Prisma, PrismaService } from "../../../prisma";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../../env";
import { EntityService } from "../..";
import { EnumUserActionType } from "../types";
import { AmplicationError } from "../../../errors/AmplicationError";
import { isDBImportMetadata } from "./utils/type-guards";
import { CreateUserActionArgs, UserAction } from "../dto";

@Injectable()
export class DBSchemaImportService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly entityService: EntityService
  ) {}

  async startProcessingPrismaSchema(
    file: string,
    fileName: string,
    args: CreateUserActionArgs,
    user: User
  ): Promise<UserAction> {
    // create action record
    const dbSchemaUploadAction = await this.prisma.userAction.create({
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
              create: this.createInitialStepData(),
            },
          },
        },
      },
    });

    // push to kafka: actionId and file
    const prismaSchemaUploadEvent: DBSchemaImportRequest.KafkaEvent = {
      key: null,
      value: {
        actionId: dbSchemaUploadAction.actionId,
        file,
      },
    };

    await this.kafkaProducerService.emitMessage(
      this.configService.get(Env.DB_SCHEMA_IMPORT_TOPIC),
      prismaSchemaUploadEvent
    );

    return dbSchemaUploadAction;
  }

  async onPrismaSchemaUploadEventProcessed(
    response: DBSchemaImportRequest.Value
  ) {
    // call the entity service create entities from prisma schema (action run)
    const { actionId, file } = response;
    const prismaSchemaUpload = await this.prisma.userAction.findFirst({
      where: {
        actionId,
      },
    });

    if (!prismaSchemaUpload) {
      throw new AmplicationError(
        `Prisma schema upload action with id ${actionId} not found`
      );
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: prismaSchemaUpload.userId,
      },
    });

    if (!user) {
      throw new AmplicationError(
        `User with id ${prismaSchemaUpload.userId} not found`
      );
    }

    if (!prismaSchemaUpload.resourceId) {
      throw new AmplicationError(
        `Resource id is missing for action with id ${actionId}`
      );
    }

    if (isDBImportMetadata(prismaSchemaUpload.metadata)) {
      await this.entityService.createEntitiesFromPrismaSchema(
        actionId,
        file,
        prismaSchemaUpload.metadata.fileName,
        prismaSchemaUpload.resourceId,
        user
      );
    } else {
      throw new AmplicationError(
        `Metadata is not in the expected format for action with id ${actionId}`
      );
    }
  }

  private createInitialStepData(): Prisma.ActionStepCreateWithoutActionInput {
    return {
      name: "Upload Prisma Schema",
      message: "Starting to create entities from Prisma schema",
      status: "Running",
      completedAt: new Date(),
      logs: {
        create: [
          {
            message: "Starting to create entities from Prisma schema",
            level: "Info",
            meta: {},
          },
        ],
      },
    };
  }
}
