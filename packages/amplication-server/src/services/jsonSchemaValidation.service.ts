import { SchemaValidationResult } from "../dto/schemaValidationResult";
import Ajv from "ajv";
import ajvErrors from "ajv-errors";

export class JsonSchemaValidationService {
  public async validateSchema(
    // eslint-disable-next-line @typescript-eslint/ban-types
    schema: object,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data: any
  ): Promise<SchemaValidationResult> {
    try {
      const ajv: Ajv.Ajv = new Ajv({ allErrors: true });

      ajv.addKeyword("isNotEmpty", {
        type: "string",
        validate: function (schema, data) {
          return typeof data === "string" && data.trim() !== "";
        },
        errors: true,
      });
      ajvErrors(ajv);

      const isValid = ajv.validate(schema, data);

      if (!isValid) {
        return new SchemaValidationResult(false, ajv.errorsText());
      }
      return new SchemaValidationResult(true);
    } catch (error) {
      return new SchemaValidationResult(false, error);
    }
  }
}
