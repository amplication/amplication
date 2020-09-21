/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Test, TestingModule } from '@nestjs/testing';
import Ajv from 'ajv';
import { error } from 'console';
import { SchemaValidationResult } from 'src/dto/schemaValidationResult';
import { JsonSchemaValidationService } from './jsonSchemaValidation.service';

jest.mock('ajv');

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
    Ajv.prototype.validate.mockImplementation(() => {
      return true;
    });
    const args = {
      schema: {},
      data: {}
    };
    expect(await service.validateSchema(args.schema, args.data)).toEqual(
      new SchemaValidationResult(true)
    );
  });

  it('should not validate a schema', async () => {
    Ajv.prototype.validate.mockImplementation(() => {
      return false;
    });
    const args = {
      schema: {},
      data: {}
    };
    expect(await service.validateSchema(args.schema, args.data)).toEqual(
      new SchemaValidationResult(false, Ajv.prototype.errorsText())
    );
  });
});
