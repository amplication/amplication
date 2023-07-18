import { capitalCase } from "capital-case";
import { ToggleField, TextField } from "@amplication/ui/design-system";
import EntitySelectField from "../Components/EntitySelectField";
import EnumSelectField from "../Components/EnumSelectField";
import RelatedEntityFieldField from "./RelatedEntityFieldField";
import RelationAllowMultipleField from "../Components/RelationAllowMultipleField";
import { Schema } from "@amplication/code-gen-types";
import OptionSet from "../Entity/OptionSet";
import { JSONSchema7 } from "json-schema";
import RelationFkHolderField from "./RelationFkHolderField";
import * as models from "../models";

type Props = {
  propertyName: string;
  propertySchema: Schema;
  isDisabled?: boolean;
  resourceId: string;
  entity: models.Entity;
  isSystemData?: boolean;
};

export const SchemaField = ({
  propertyName,
  propertySchema,
  resourceId,
  entity,
}: Props) => {
  const fieldName = `properties.${propertyName}`;
  const label = propertySchema.title || capitalCase(propertyName);

  if (propertySchema.enum) {
    if (propertySchema.enum.every((item) => typeof item === "string")) {
      return (
        <EnumSelectField
          label={label}
          name={fieldName}
          options={propertySchema.enum as string[]}
        />
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
