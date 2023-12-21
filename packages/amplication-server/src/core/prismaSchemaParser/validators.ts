import { validate } from "@prisma/internals";
import { Model, getSchema } from "@mrleebo/prisma-ast";
import { MODEL_TYPE_NAME } from "./constants";
import { ActionLog, EnumActionLogLevel } from "../action/dto";

/**
 * This function is a wrapper around the validate function of the Prisma and our custom validation logic
 * @param schema the schema file that was uploaded
 * @param actionContext an object containing functions to emit logs and complete the action
 * @returns
 */
export function isValidSchema(schema: string): {
  isValid: boolean;
  errorMessage?: string;
} {
  const validatePrismaSchemaUploadResponse = validatePrismaSchemaUpload(schema);

  if (!validatePrismaSchemaUploadResponse.isValid) {
    return {
      isValid: false,
      errorMessage: validatePrismaSchemaUploadResponse.errorMessage,
    };
  }

  const validationLog = validateSchemaProcessing(schema);
  const isErrorsValidationLog = validationLog.some(
    (log) => log.level === EnumActionLogLevel.Error
  );

  if (isErrorsValidationLog) {
    return {
      isValid: false,
      errorMessage: "Prisma Schema Validation Failed",
    };
  }

  if (!isErrorsValidationLog && validatePrismaSchemaUploadResponse.isValid) {
    return {
      isValid: true,
    };
  }
}

/**
 * Validate schema by Prisma
 * @param file the schema file that was uploaded
 * @throws if the schema is invalid
 * @returns void
 **/
function validatePrismaSchemaUpload(file: string): {
  isValid: boolean;
  errorMessage?: string;
} {
  const schemaString = file.replace(/\\n/g, "\n");
  try {
    validate({ datamodel: schemaString });
    return {
      isValid: true,
    };
  } catch (error) {
    return {
      isValid: false,
      errorMessage: `Prisma Schema Validation Failed: ${error.message}`,
    };
  }
}

/**
 * Get the schema as a string after the upload and validate it against the schema validation rules for models and fields
 * @param schema schema string
 * @returns array of errors if there are any or null if there are no errors
 */
function validateSchemaProcessing(schema: string): ActionLog[] {
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
