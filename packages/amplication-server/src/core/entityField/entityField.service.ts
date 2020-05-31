import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { EntityField } from 'src/models';
import { PrismaService } from 'src/services/prisma.service';
import { JsonSchemaValidationService } from 'src/services/jsonSchemaValidation.service';
import { FindOneArgs } from 'src/dto';
import { EnumDataType } from 'src/enums/EnumDataType';
import { CreateOneEntityFieldArgs, UpdateOneEntityFieldArgs } from './dto';
import { SchemaValidationResult } from 'src/dto/schemaValidationResult';
import { entityFieldPropertiesValidationSchemaFactory as schemaFactory } from './entityFieldPropertiesValidationSchemaFactory';

const INITIAL_VERSION_NUMBER = 0;

@Injectable()
export class EntityFieldService {
  constructor(
    private readonly prisma: PrismaService,
    private schemaValidation: JsonSchemaValidationService
  ) {}

  async entityField(args: FindOneArgs): Promise<EntityField | null> {
    return this.prisma.entityField.findOne(args);
  }

  // async entityFields(@Context() ctx: any, @Args() args: FindManyEntityFieldArgs): Promise<EntityField[]> {
  //   return ctx.prisma.entityField.findMany(args);
  // }

  private async validateFieldProperties(
    dataType: EnumDataType,
    properties: string
  ): Promise<SchemaValidationResult> {
    try {
      const data = JSON.parse(properties);
      let schema = schemaFactory.getSchema(dataType);
      let schemaValidation = await this.schemaValidation.validateSchema(
        schema,
        data
      );

      //if schema is not valid - return false, otherwise continue with ret of the checks
      if (!schemaValidation.isValid) {
        return schemaValidation;
      }

      switch (dataType) {
        case EnumDataType.lookup:
          //check if the actual selected entity exist and can be referenced by this field
          break;

        case (EnumDataType.optionSet, EnumDataType.multiSelectOptionSet):
          //check if the actual selected option set exist and can be referenced by this field
          break;

        //todo: add other data type specific checks
        default:
          break;
      }

      return schemaValidation;
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
    let validationResults = await this.validateFieldProperties(
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
