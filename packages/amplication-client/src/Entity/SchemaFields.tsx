import { SchemaField } from "./SchemaField";
import { Schema } from "@amplication/code-gen-types";

type Props = {
  schema: Schema;
  isDisabled?: boolean;
  resourceId: string;
  entityDisplayName: string;
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

  if (schema?.properties) {
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
  }
  return null;
};
