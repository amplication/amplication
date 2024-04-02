import { capitalCase } from "capital-case";
import {
  ToggleField,
  TextField,
  OptionItem,
  SelectField,
} from "@amplication/ui/design-system";
import EntitySelectField from "../Components/EntitySelectField";
import RelatedEntityFieldField from "./RelatedEntityFieldField";
import RelationAllowMultipleField from "../Components/RelationAllowMultipleField";
import { Schema } from "@amplication/code-gen-types";
import OptionSet from "../Entity/OptionSet";
import { JSONSchema7 } from "json-schema";
import RelationFkHolderField from "./RelationFkHolderField";
import * as models from "../models";
import { useMemo } from "react";
import { ENTITY_FIELD_ENUM_MAPPER } from "./constants";

type Props = {
  fieldDataType: models.EnumDataType;
  propertyName: string;
  propertySchema: Schema;
  isDisabled?: boolean;
  resourceId: string;
  entity: models.Entity;
  isSystemData?: boolean;
};

export const SchemaField = ({
  fieldDataType,
  propertyName,
  propertySchema,
  resourceId,
  entity,
}: Props) => {
  const fieldName = `properties.${propertyName}`;
  const label = propertySchema.title || capitalCase(propertyName);

  const enumOptions = useMemo((): OptionItem[] | null => {
    if (propertySchema.enum) {
      return (propertySchema.enum as string[]).map((item) => {
        const labelByItem: { label: string; value: string } =
          ENTITY_FIELD_ENUM_MAPPER[fieldDataType][propertyName].find(
            (option) => option.value === item
          );

        return {
          value: item,
          label: labelByItem.label || item,
        };
      });
    } else return null;
  }, [fieldDataType, propertyName, propertySchema]);

  if (propertySchema.enum) {
    if (propertySchema.enum.every((item) => typeof item === "string")) {
      return (
        <SelectField label={label} name={fieldName} options={enumOptions} />
      );
    } else {
      throw new Error(
        `Enum members of unexpected type ${JSON.stringify(propertySchema.enum)}`
      );
    }
  }

  switch (propertySchema.type) {
    case "string": {
      return <TextField name={fieldName} label={label} />;
    }
    case "integer":
    case "number": {
      return <TextField type="number" name={fieldName} label={label} />;
    }
    case "boolean": {
      return <ToggleField name={fieldName} label={label} />;
    }
    case "array": {
      if (!propertySchema.items) {
        throw new Error("Array schema must define items");
      }

      switch ((propertySchema.items as JSONSchema7).type) {
        case "object": {
          return <OptionSet label={label} name={fieldName} />;
        }
        default: {
          throw new Error(
            `Unexpected propertySchema.items.type: ${propertySchema.type}`
          );
        }
      }
    }
    default: {
      switch (propertySchema?.$ref) {
        case "#/definitions/EntityId": {
          return (
            <EntitySelectField
              label={label}
              name={fieldName}
              resourceId={resourceId}
              isValueId
            />
          );
        }
        case "#/definitions/RelationFkHolder": {
          return (
            <RelationFkHolderField
              entity={entity}
              label={label}
              name={fieldName}
            />
          );
        }
        case "#/definitions/EntityFieldId": {
          return (
            <RelatedEntityFieldField entityDisplayName={entity.displayName} />
          );
        }
        case "#/definitions/RelationAllowMultiple": {
          return (
            <RelationAllowMultipleField
              fieldName={fieldName}
              entityDisplayName={entity.displayName}
            />
          );
        }
      }

      throw new Error(`Unexpected propertySchema.type: ${propertySchema.type}`);
    }
  }
};
