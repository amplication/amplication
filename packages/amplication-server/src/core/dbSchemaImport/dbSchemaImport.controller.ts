import { EnvironmentVariables } from "@amplication/util/kafka";
import { Controller, Inject } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { DBSchemaImportRequest } from "@amplication/schema-registry";
import { Env } from "../../env";
import { plainToInstance } from "class-transformer";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { DBSchemaImportService } from "./dbSchemaImport.service";

@Controller("db-schema-import")
export class DBSchemaImportController {
  constructor(
    private readonly dbSchemaImportService: DBSchemaImportService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @EventPattern(
    EnvironmentVariables.instance.get(Env.DB_SCHEMA_IMPORT_TOPIC, true)
  )
  async onDBSchemaImportRequest(
    @Payload() message: DBSchemaImportRequest.KafkaEvent
  ): Promise<void> {
    try {
      const args = plainToInstance(DBSchemaImportRequest.Value, message);
      void this.dbSchemaImportService.createEntitiesFromPrismaSchema(args);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
