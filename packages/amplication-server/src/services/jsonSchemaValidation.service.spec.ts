/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Test, TestingModule } from '@nestjs/testing';
import Ajv from 'ajv';
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
    expect(Ajv.prototype.validate).toBeCalledTimes(1);
    expect(Ajv.prototype.validate).toBeCalledWith(args.schema, args.data);
  });

  it('should not validate a schema', async () => {
    Ajv.prototype.validate.mockImplementation(() => {
      return false;
    });
    Ajv.prototype.errorsText.mockImplementation(() => {
      return 'Error: Invalid';
    });
    const args = {
      schema: {},
      data: {}
    };
    expect(await service.validateSchema(args.schema, args.data)).toEqual(
      new SchemaValidationResult(false, 'Error: Invalid')
    );
    expect(Ajv.prototype.validate).toBeCalledTimes(1);
    expect(Ajv.prototype.validate).toBeCalledWith(args.schema, args.data);
    expect(Ajv.prototype.errorsText).toBeCalledTimes(1);
    expect(Ajv.prototype.errorsText).toBeCalledWith();
  });
});
