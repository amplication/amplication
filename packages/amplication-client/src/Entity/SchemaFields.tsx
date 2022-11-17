import { SchemaField } from "./SchemaField";
import { Schema } from "@amplication/code-gen-types";

type Props = {
  schema: Schema;
  entityDisplayName: string;
  resourceId: string;
  isDisabled?: boolean;
};

export const SchemaFields = ({
  schema,
  isDisabled,
  resourceId,
  entityDisplayName,
}: Props) => {
  if (schema === null) {
    return null;
  }

  if (schema.type !== "object") {
    throw new Error(`Unexpected type ${schema.type}`);
  }

  return (
    <div>
      {Object.entries(schema.properties).map(([name, property]) => {
        if (!property) {
          throw new Error(`Missing property: ${name}`);
        }
        return (
          <SchemaField
            key={name}
            propertyName={name}
            propertySchema={property as Schema}
            isDisabled={isDisabled}
            resourceId={resourceId}
            entityDisplayName={entityDisplayName}
          />
        );
      })}
    </div>
  );
  return null;
};
