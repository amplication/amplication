import React from "react";
import { capitalCase } from "capital-case";
import { ToggleField, TextField } from "@amplication/design-system";
import EntitySelectField from "../Components/EntitySelectField";
import EnumSelectField from "../Components/EnumSelectField";
import RelatedEntityFieldField from "../Components/RelatedEntityFieldField";
import { Schema } from "@amplication/data";
import OptionSet from "../Entity/OptionSet";

export const SchemaField = ({
  propertyName,
  propertySchema,
  isDisabled,
  applicationId,
}: {
  propertyName: string;
  propertySchema: Schema;
  isDisabled?: boolean;
  applicationId: string;
}) => {
  const fieldName = `properties.${propertyName}`;
  const label = propertySchema.title || capitalCase(propertyName);

  if (propertySchema.enum) {
    if (propertySchema.enum.every((item) => typeof item === "string")) {
      return (
        <EnumSelectField
          label={label}
          name={fieldName}
          disabled={isDisabled}
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
      return <TextField name={fieldName} label={label} disabled={isDisabled} />;
    }
    case "integer":
    case "number": {
      return (
        <TextField
          type="number"
          name={fieldName}
          label={label}
          disabled={isDisabled}
        />
      );
    }
    case "boolean": {
      return (
        <ToggleField name={fieldName} label={label} disabled={isDisabled} />
      );
    }
    case "array": {
      if (!propertySchema.items) {
        throw new Error("Array schema must define items");
      }

      switch (propertySchema.items.type) {
        case "object": {
          return (
            <OptionSet label={label} name={fieldName} isDisabled={isDisabled} />
          );
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
              disabled={isDisabled}
              applicationId={applicationId}
            />
          );
        }
        // Hide entity field ID properties
        case "#/definitions/EntityFieldId": {
          return <RelatedEntityFieldField />;
          //return null;
        }
      }

      throw new Error(`Unexpected propertySchema.type: ${propertySchema.type}`);
    }
  }
};
