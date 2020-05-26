import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { EntityField } from '../../models';
import { PrismaService } from '../../services/prisma.service';
import { FindOneArgs } from '../../dto/args';
import { EnumDataType } from '../../enums/EnumDataType';
import {
  CreateOneEntityFieldArgs,
  UpdateOneEntityFieldArgs
} from '../../dto/args';
import { SchemaValidationResult } from '../../dto/schemaValidationResult';
import { entityFieldPropertiesValidationSchemaFactory as schemaFactory } from './entityFieldPropertiesValidationSchemaFactory';
import Ajv from 'ajv';

const INITIAL_VERSION_NUMBER = 0;

@Injectable()
export class EntityFieldService {
  constructor(private readonly prisma: PrismaService) {}

  async entityField(args: FindOneArgs): Promise<EntityField | null> {
    return this.prisma.entityField.findOne(args);
  }

  // async entityFields(@Context() ctx: any, @Args() args: FindManyEntityFieldArgs): Promise<EntityField[]> {
  //   return ctx.prisma.entityField.findMany(args);
  // }

  private async validateFieldPropertiesSchema(
    dataType: EnumDataType,
    properties: string
  ): Promise<SchemaValidationResult> {
    try {
      const obj = JSON.parse(properties);

      let schema = schemaFactory.getSchema(dataType);

      let ajv: Ajv.Ajv = new Ajv({ allErrors: true }); //todo: move to a separate service

      let isValid = ajv.validate(schema, obj);

      if (!isValid) {
        console.log(ajv.errorsText());
        return new SchemaValidationResult(false, ajv.errorsText());
      }
      return new SchemaValidationResult(true);

    } catch (error) {
        return new SchemaValidationResult(false, error);
    }
  }

  async createEntityField(
    args: CreateOneEntityFieldArgs
  ): Promise<EntityField> {
    // Set initial field version
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: args.data.entity.connect.id },
        versionNumber: INITIAL_VERSION_NUMBER
      }
    });

    let currentVersionId = '';
    if (entityVersions.length > 0) {
      currentVersionId = entityVersions[0].id;
    } else {
      throw new ConflictException(
        "Can't find the current version for the requested entity"
      );
    }

    //validate the properties
    let validationResults = await this.validateFieldPropertiesSchema(
      EnumDataType[args.data.dataType],
      args.data.properties
    );
    if (!validationResults.isValid) {
      throw new ConflictException(
        `Cannot validate the Entity Field Properties. ${validationResults.errorText}`
      );
    }

    args.data.entityVersion = {
      connect: {
        id: currentVersionId
      }
    };
    let entity, data;

    ({ entity, ...data } = args.data);

    return this.prisma.entityField.create({ data: data });
  }

  async updateEntityField(
    args: UpdateOneEntityFieldArgs
  ): Promise<EntityField> {
    //Validate the field is linked to current version (other versions cannot be updated)
    const entityField = await this.prisma.entityField.findOne({
      where: { id: args.where.id },
      include: {
        entityVersion: true
      }
    });

    if (!entityField) {
      throw new NotFoundException(`Cannot find entity field ${args.where.id}`);
    }

    if (entityField.entityVersion.versionNumber !== 0) {
      throw new ConflictException(
        `Cannot update fields of previous versions (version ${entityField.entityVersion.versionNumber}) `
      );
    }

    //todo: validate the field was not published -
    //only specific properties of fields that were already published can be updated

    return this.prisma.entityField.update(args);
  }
}
