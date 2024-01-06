import {
  Entity,
  EntityField,
  EnumDataType,
  ModuleDtoProperty,
  types,
} from "@amplication/code-gen-types";
import {
  EnumModuleDtoPropertyType,
  PropertyTypeDef,
} from "@amplication/code-gen-types/models";
import { property } from "lodash";

const FIELD_TYPE_TO_PROPERTY_TYPE: {
  [key in EnumDataType]: (field: EntityField) => PropertyTypeDef[];
} = {
  [EnumDataType.Id]: (field) => {
    const props = field.properties as types.Id;
    switch (props.idType) {
      case "CUID":
        return [
          {
            type: EnumModuleDtoPropertyType.String,
            isArray: false,
          },
        ];
      case "UUID":
        return [
          {
            type: EnumModuleDtoPropertyType.String,
            isArray: false,
          },
        ];
      case "AUTO_INCREMENT":
        return [
          {
            type: EnumModuleDtoPropertyType.String,
            isArray: false,
          },
        ];
      case "AUTO_INCREMENT_BIG_INT":
        return [
          {
            type: EnumModuleDtoPropertyType.String,
            isArray: false,
          },
        ];
    }
  },
  [EnumDataType.Lookup]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.Dto,
        isArray: false,
      },
    ];
  },
  [EnumDataType.MultiSelectOptionSet]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.Enum,
        isArray: true,
        dtoId: "", //@todo: add dtoId
      },
    ];
  },
  [EnumDataType.OptionSet]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.Enum,
        isArray: false,
        dtoId: "", //@todo: add dtoId
      },
    ];
  },
  [EnumDataType.Password]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.String,
        isArray: false,
      },
    ];
  },
  [EnumDataType.CreatedAt]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.DateTime,
        isArray: false,
      },
    ];
  },
  [EnumDataType.UpdatedAt]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.DateTime,
        isArray: false,
      },
    ];
  },
  [EnumDataType.Email]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.String,
        isArray: false,
      },
    ];
  },
  [EnumDataType.WholeNumber]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.Integer,
        isArray: false,
      },
    ];
  },
  [EnumDataType.DecimalNumber]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.Float,
        isArray: false,
      },
    ];
  },
  [EnumDataType.Boolean]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.Boolean,
        isArray: false,
      },
    ];
  },
  [EnumDataType.DateTime]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.DateTime,
        isArray: false,
      },
    ];
  },
  [EnumDataType.GeographicLocation]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.String,
        isArray: false,
      },
    ];
  },
  [EnumDataType.Json]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.Json,
        isArray: false,
      },
    ];
  },
  [EnumDataType.MultiLineText]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.String,
        isArray: false,
      },
    ];
  },
  [EnumDataType.Roles]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.Json,
        isArray: false,
      },
    ];
  },
  [EnumDataType.SingleLineText]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.String,
        isArray: false,
      },
    ];
  },
  [EnumDataType.Username]: (field) => {
    return [
      {
        type: EnumModuleDtoPropertyType.String,
        isArray: false,
      },
    ];
  },
};

export const createEntityProperties = (
  entity: Entity,
  fields: EntityField[]
): ModuleDtoProperty[] => {
  return fields.map((field) => {
    return {
      name: field.name,
      propertyTypes: FIELD_TYPE_TO_PROPERTY_TYPE[field.dataType](field),
      isOptional: !field.required,
      isArray: false,
    };
  });
};
