import { SchemaValidationResult } from '../dto/schemaValidationResult';
import Ajv from 'ajv';

export class JsonSchemaValidationService {
  public async validateSchema(
    schema: object,
    data: any
  ): Promise<SchemaValidationResult> {
    try {
      let ajv: Ajv.Ajv = new Ajv({ allErrors: true });

      let isValid = ajv.validate(schema, data);

      if (!isValid) {
        console.log(ajv.errorsText());
        return new SchemaValidationResult(false, ajv.errorsText());
      }
      return new SchemaValidationResult(true);
    } catch (error) {
      return new SchemaValidationResult(false, error);
    }
  }
}
