import { SchemaValidationResult } from '../dto/schemaValidationResult';
import Ajv from 'ajv';

export class JsonSchemaValidationService {
  public async validateSchema(
    schema: Record<string, unknown>,
    data: any
  ): Promise<SchemaValidationResult> {
    try {
      const ajv: Ajv.Ajv = new Ajv({ allErrors: true });

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
