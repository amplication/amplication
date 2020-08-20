import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { JsonValue } from 'type-fest';
import { EntityField } from 'src/models';
import { PrismaService } from 'src/services/prisma.service';
import { JsonSchemaValidationService } from 'src/services/jsonSchemaValidation.service';
import { EntityService } from 'src/core/entity/entity.service';
import { FindOneArgs } from 'src/dto';
import { EnumDataType } from 'src/enums/EnumDataType';
import {
  CreateOneEntityFieldArgs,
  UpdateOneEntityFieldArgs,
  EntityFieldCreateInput,
  EntityFieldUpdateInput
} from './dto';
import { SchemaValidationResult } from 'src/dto/schemaValidationResult';
import { EntityFieldPropertiesValidationSchemaFactory as schemaFactory } from './entityFieldPropertiesValidationSchemaFactory';
import { CURRENT_VERSION_NUMBER } from './constants';

/**
 * Expect format for entity field name, matches the format of JavaScript variable name
 */
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
export const NAME_VALIDATION_ERROR_MESSAGE =
  'Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number';

@Injectable()
export class EntityFieldService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entityService: EntityService,
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
    properties: JsonValue
  ): Promise<SchemaValidationResult> {
    try {
      const data = properties;
      const schema = schemaFactory.getSchema(dataType);
      const schemaValidation = await this.schemaValidation.validateSchema(
        schema,
        data
      );

      //if schema is not valid - return false, otherwise continue with ret of the checks
      if (!schemaValidation.isValid) {
        return schemaValidation;
      }

      switch (dataType) {
        case EnumDataType.Lookup:
          //check if the actual selected entity exist and can be referenced by this field
          break;

        case (EnumDataType.OptionSet, EnumDataType.MultiSelectOptionSet):
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

  private async getEntityCurrentVersion(entityId: string) {
    // Set initial field version
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: entityId },
        versionNumber: CURRENT_VERSION_NUMBER
      }
    });

    if (entityVersions.length === 0) {
      throw new ConflictException(
        "Can't find the current version for the requested entity"
      );
    }

    const [currentVersion] = entityVersions;

    return currentVersion;
  }

  /** Validate name value conforms expected format */
  static validateName(name: string): void {
    if (!NAME_REGEX.test(name)) {
      throw new ConflictException(NAME_VALIDATION_ERROR_MESSAGE);
    }
  }

  async validateData(
    data: EntityFieldCreateInput | EntityFieldUpdateInput
  ): Promise<void> {
    // Validate name
    EntityFieldService.validateName(data.name);

    // Validate the properties
    const validationResults = await this.validateFieldProperties(
      EnumDataType[data.dataType],
      data.properties
    );

    if (!validationResults.isValid) {
      throw new ConflictException(
        `Cannot validate the Entity Field Properties. ${validationResults.errorText}`
      );
    }
  }

  async createEntityField(
    args: CreateOneEntityFieldArgs
  ): Promise<EntityField> {
    // Extract entity from data
    const { entity, ...data } = args.data;

    // Validate entity field data
    await this.validateData(data);

    // Get field's entity current version
    const currentEntityVersion = await this.entityService.getEntityVersion(
      entity.connect.id,
      CURRENT_VERSION_NUMBER
    );

    // Create entity field
    return this.prisma.entityField.create({
      data: {
        ...data,
        entityVersion: { connect: { id: currentEntityVersion.id } }
      }
    });
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

    if (entityField.entityVersion.versionNumber !== CURRENT_VERSION_NUMBER) {
      throw new ConflictException(
        `Cannot update fields of previous versions (version ${entityField.entityVersion.versionNumber}) `
      );
    }

    // Validate entity field data
    await this.validateData(args.data);

    //todo: validate the field was not published -
    //only specific properties of fields that were already published can be updated

    return this.prisma.entityField.update(args);
  }
}
