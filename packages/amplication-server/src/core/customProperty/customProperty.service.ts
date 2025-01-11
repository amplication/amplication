import { Injectable } from "@nestjs/common";
import { isEmpty, snakeCase, toUpper } from "lodash";
import { JsonArray } from "type-fest";
import { FindOneArgs } from "../../dto";
import { AmplicationError } from "../../errors/AmplicationError";
import { CustomProperty } from "../../models";
import { CustomPropertyOption } from "../../models/CustomPropertyOption";
import {
  CustomProperty as PrismaCustomProperty,
  PrismaService,
} from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalyticsEventType.types";
import { prepareDeletedItemName } from "../../util/softDelete";
import { CreateCustomPropertyOptionArgs } from "./dto/CreateCustomPropertyOptionArgs";
import { CustomPropertyCreateArgs } from "./dto/CustomPropertyCreateArgs";
import { CustomPropertyFindManyArgs } from "./dto/CustomPropertyFindManyArgs";
import { DeleteCustomPropertyOptionArgs } from "./dto/DeleteCustomPropertyOptionArgs.ts";
import { EnumCustomPropertyType } from "./dto/EnumCustomPropertyType";
import { UpdateCustomPropertyArgs } from "./dto/UpdateCustomPropertyArgs";
import { UpdateCustomPropertyOptionArgs } from "./dto/UpdateCustomPropertyOptionArgs";

export const INVALID_CUSTOM_PROPERTY_ID = "Invalid customPropertyId";
import type { JSONSchema7 as JSONSchema } from "json-schema";
import { JsonSchemaValidationService } from "../../services/jsonSchemaValidation.service";
import { SchemaValidationResult } from "../../dto/schemaValidationResult";

@Injectable()
export class CustomPropertyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analytics: SegmentAnalyticsService,
    private readonly jsonSchemaValidationService: JsonSchemaValidationService
  ) {}

  async customProperties(
    args: CustomPropertyFindManyArgs
  ): Promise<CustomProperty[]> {
    args.where = args.where || {};

    //when searching for properties, without specifying blueprintId or blueprint, we should return only global properties
    if (
      args.where.blueprintId === undefined &&
      args.where.blueprint === undefined
    ) {
      args.where.blueprintId = null;
    }

    const properties = await this.prisma.customProperty.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });

    return properties.map((property) =>
      this.customPropertyRecordToModel(property)
    );
  }

  async customProperty(args: FindOneArgs): Promise<CustomProperty> {
    const property = await this.prisma.customProperty.findUnique({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });

    return this.customPropertyRecordToModel(property);
  }

  async createCustomProperty(
    args: CustomPropertyCreateArgs
  ): Promise<CustomProperty> {
    const key = toUpper(snakeCase(args.data.name));

    const customProperty = await this.prisma.customProperty.create({
      data: {
        ...args.data,
        type: EnumCustomPropertyType.Select,
        enabled: true,
        key,
        workspace: {
          connect: {
            id: args.data.workspace.connect.id,
          },
        },
      },
    });
    await this.analytics.trackWithContext({
      event: EnumEventType.CustomPropertyCreate,
      properties: {
        name: customProperty.name,
      },
    });

    return this.customPropertyRecordToModel(customProperty);
  }

  async deleteCustomProperty(args: FindOneArgs): Promise<CustomProperty> {
    const customProperty = await this.customProperty(args);

    if (isEmpty(customProperty)) {
      throw new AmplicationError(INVALID_CUSTOM_PROPERTY_ID);
    }

    const updatedCustomProperty = await this.prisma.customProperty.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(customProperty.name, customProperty.id),
        key: prepareDeletedItemName(customProperty.key, customProperty.id),
        deletedAt: new Date(),
      },
    });
    await this.analytics.trackWithContext({
      event: EnumEventType.CustomPropertyDelete,
      properties: {
        name: customProperty.name,
      },
    });

    return this.customPropertyRecordToModel(updatedCustomProperty);
  }

  async updateCustomProperty(
    args: UpdateCustomPropertyArgs
  ): Promise<CustomProperty> {
    const customProperty = await this.prisma.customProperty.update({
      where: { ...args.where },
      data: {
        ...args.data,
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.CustomPropertyUpdate,
      properties: {
        name: customProperty.name,
      },
    });

    return this.customPropertyRecordToModel(customProperty);
  }

  customPropertyRecordToModel(record: PrismaCustomProperty): CustomProperty {
    if (!record) {
      return null;
    }
    return {
      ...record,
      options: record.options
        ? (record.options as unknown as CustomPropertyOption[])
        : null,
    };
  }

  async createOption(
    args: CreateCustomPropertyOptionArgs
  ): Promise<CustomPropertyOption> {
    const property = await this.customProperty({
      where: { id: args.data.customProperty.connect.id },
    });
    if (!property) {
      throw new AmplicationError(
        `Custom Property not found, ID: ${args.data.customProperty.connect.id}`
      );
    }

    const existingOption = property.options?.find(
      (option) => option.value === args.data.value
    );
    if (existingOption) {
      throw new AmplicationError(
        `Option already exists, name: ${args.data.value}, Custom Property ID: ${args.data.customProperty.connect.id}`
      );
    }

    const newProperty: CustomPropertyOption = {
      value: args.data.value,
      color: "#FFF",
    };

    await this.prisma.customProperty.update({
      where: {
        id: args.data.customProperty.connect.id,
      },
      data: {
        options: [
          ...(property.options || []),
          newProperty,
        ] as unknown as JsonArray,
      },
    });

    return newProperty;
  }

  async updateOption(
    args: UpdateCustomPropertyOptionArgs
  ): Promise<CustomPropertyOption> {
    const property = await this.customProperty({
      where: { id: args.where.customProperty.id },
    });
    if (!property) {
      throw new AmplicationError(
        `Custom Property not found, ID: ${args.where.customProperty.id}`
      );
    }

    if (!property.options) {
      throw new AmplicationError(
        `Option not found, name: ${args.where.value}, Custom Property ID: ${args.where.customProperty.id}`
      );
    }

    const existingOptionIndex = property.options?.findIndex(
      (option) => option.value === args.where.value
    );

    if (existingOptionIndex === -1) {
      throw new AmplicationError(
        `Option not found, name: ${args.where.value}, Custom Property ID: ${args.where.customProperty.id}`
      );
    }

    if (args.data.value !== args.where.value) {
      const existingOptionWithNewName = property.options.find(
        (option) => option.value === args.data.value
      );
      if (existingOptionWithNewName) {
        throw new AmplicationError(
          `Option already exists, name: ${args.data.value}, Custom Property ID: ${args.where.customProperty.id}`
        );
      }
    }

    const existingOption = property.options[existingOptionIndex];

    const newOption = {
      ...existingOption,
      ...args.data,
    };

    property.options[existingOptionIndex] = newOption;

    await this.prisma.customProperty.update({
      where: {
        id: args.where.customProperty.id,
      },
      data: {
        options: property.options as unknown as JsonArray,
      },
    });

    return newOption;
  }

  async deleteOption(
    args: DeleteCustomPropertyOptionArgs
  ): Promise<CustomPropertyOption> {
    const property = await this.customProperty({
      where: { id: args.where.customProperty.id },
    });
    if (!property) {
      throw new AmplicationError(
        `Custom Property not found, ID: ${args.where.customProperty.id}`
      );
    }

    const existingOptionIndex = property.options?.findIndex(
      (option) => option.value === args.where.value
    );

    if (existingOptionIndex === -1) {
      throw new AmplicationError(
        `Options not found, name: ${args.where.value}, Custom Property ID: ${args.where.customProperty.id}`
      );
    }

    const [deleted] = property.options.splice(existingOptionIndex, 1);

    await this.prisma.customProperty.update({
      where: {
        id: property.id,
      },
      data: {
        options: property.options as unknown as JsonArray,
      },
    });

    return deleted;
  }

  async validateCustomProperties(
    customProperties: CustomProperty[],
    data: Record<string, unknown>
  ): Promise<SchemaValidationResult> {
    try {
      const schema = this.getValidationSchema(customProperties);
      return this.jsonSchemaValidationService.validateSchema(schema, data);
    } catch (error) {
      return new SchemaValidationResult(false, error);
    }
  }

  getValidationSchema(customProperties: CustomProperty[]): JSONSchema & {
    errorMessage: {
      properties: Record<string, string>;
    };
  } {
    const properties: Record<string, JSONSchema> = {};
    const required: string[] = [];
    const errorMessage = {
      properties: {},
    };

    for (const customProperty of customProperties) {
      const key = customProperty.key;
      const schema: JSONSchema & {
        isNotEmpty?: boolean;
      } = {
        title: customProperty.name,
        type: "string",
      };

      if (customProperty.type === EnumCustomPropertyType.Select) {
        schema.enum = customProperty.options.map((option) => option.value);
      }

      if (customProperty.type === EnumCustomPropertyType.MultiSelect) {
        schema.type = "array";
        schema.items = {
          type: "string",
          enum: customProperty.options.map((option) => option.value),
        };
      }

      if (customProperty.required) {
        required.push(key);
        schema.isNotEmpty = true;
        errorMessage.properties[key] = `${customProperty.name} is required`;

        if (customProperty.type === EnumCustomPropertyType.MultiSelect) {
          schema.minItems = 1;
          errorMessage.properties[
            key
          ] = `At least one ${customProperty.name} is required`;
        }
      }

      if (customProperty.validationRule) {
        schema.pattern = customProperty.validationRule;
        errorMessage.properties[key] = customProperty.validationMessage;
      }

      properties[key] = schema;
    }

    return {
      additionalProperties: false, //do not allow additional properties
      type: "object",
      required,
      errorMessage,
      properties,
    };
  }
}
