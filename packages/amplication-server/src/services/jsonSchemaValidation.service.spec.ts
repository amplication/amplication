/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Test, TestingModule } from '@nestjs/testing';
import Ajv from 'ajv';
import { SchemaValidationResult } from 'src/dto/schemaValidationResult';
import { JsonSchemaValidationService } from './jsonSchemaValidation.service';

jest.mock('ajv');
Ajv.prototype.validate.mockImplementation(() => {
  return true;
});

describe('JsonSchemaValidationService', () => {
  let service: JsonSchemaValidationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonSchemaValidationService],
      imports: []
    }).compile();

    service = module.get<JsonSchemaValidationService>(
      JsonSchemaValidationService
    );
  });

  it('should validate a schema', async () => {
    const args = {
      schema: {},
      data: {}
    };
    expect(await service.validateSchema(args.schema, args.data)).toEqual(
      new SchemaValidationResult(true)
    );
  });
});
