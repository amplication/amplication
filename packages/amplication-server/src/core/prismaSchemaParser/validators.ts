import { validate } from "@prisma/internals";
import { Model, getSchema } from "@mrleebo/prisma-ast";
import { MODEL_TYPE_NAME } from "./constants";
import { ActionLog, EnumActionLogLevel } from "../action/dto";
import { Logger } from "@nestjs/common";

/**
 * Validate schema by Prisma
 * @param file the schema file that was uploaded
 * @throws if the schema is invalid
 * @returns void
 **/
export function validateSchemaUpload(file: string): void {
  const schemaString = file.replace(/\\n/g, "\n");
  try {
    validate({ datamodel: schemaString });
  } catch (error) {
    Logger.error(error, "PrismaSchemaParser.validateSchemaUpload");
    throw error;
  }
}

/**
 * Get the schema as a string after the upload and validate it against the schema validation rules for models and fields
 * @param schema schema string
 * @returns array of errors if there are any or null if there are no errors
 */
export function validateSchemaProcessing(schema: string): ActionLog[] {
  const schemaObject = getSchema(schema);
  const errors: ActionLog[] = [];
  const models = schemaObject.list.filter(
    (item) => item.type === MODEL_TYPE_NAME
  ) as Model[];

  if (models.length === 0) {
    errors.push(
      new ActionLog({
        message: "A schema must contain at least one model",
        level: EnumActionLogLevel.Error,
      })
    );
  }

  return errors.length > 0 ? errors : [];
}
