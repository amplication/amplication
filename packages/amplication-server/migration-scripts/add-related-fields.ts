// 2020-01-04 Script to add related field id to lookup fields

import { PrismaClient, EnumDataType } from "../src/prisma";
import { types } from "@amplication/code-gen-types";
import { camelCase } from "camel-case";
import cuid from "cuid";

// For every existing lookup field create a related field
async function main() {
  const client = new PrismaClient();
  // Find all lookup fields in the database
  const lookupFields = await client.entityField.findMany({
    where: {
      dataType: EnumDataType.Lookup,
      entityVersion: {
        versionNumber: 0,
      },
    },
    include: {
      entityVersion: {
        include: {
          entity: {
            include: {
              app: {
                include: {
                  workspace: {
                    include: {
                      users: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  console.info(`Found ${lookupFields.length} fields`);
  // Filter out fields that have relatedFieldId already or their related entity id is corrupt
  const fieldsToUpdate = lookupFields.filter((field) => {
    const properties = field.properties as unknown as types.Lookup;
    return (
      !properties.relatedFieldId && !properties.relatedEntityId.startsWith("[")
    );
  });
  console.info(`Attempting to update ${fieldsToUpdate.length} fields`);
  await Promise.all(
    fieldsToUpdate.map(async (field) => {
      const properties = field.properties as unknown as types.Lookup;
      const { entity } = field.entityVersion;
      const [user] = entity.app.workspace.users;
      console.info(`Adding related field for ${field.id}...`);
      let relatedFieldName = camelCase(entity.name);
      let relatedFieldDisplayName = entity.name;

      // Find fields with the desired related field name
      const existingFieldWithName = await client.entityField.findFirst({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          OR: [
            { name: relatedFieldName },
            {
              displayName: relatedFieldDisplayName,
            },
          ],
          entityVersion: {
            entityId: properties.relatedEntityId,
            versionNumber: 0,
          },
        },
      });

      // In case name exists use a generated name
      if (
        existingFieldWithName?.name === relatedFieldName &&
        existingFieldWithName?.displayName === relatedFieldDisplayName
      ) {
        const name = `a${cuid().replace(/[^A-z0-9]/g, "")}`;
        relatedFieldName = name;
        relatedFieldDisplayName = name;
      }

      // Lock the entity
      await client.entity.update({
        where: {
          id: entity.id,
        },
        data: {
          lockedByUser: {
            connect: {
              id: user.id,
            },
          },
          lockedAt: new Date(),
        },
      });

      // Lock the related entity
      await client.entity.update({
        where: {
          id: properties.relatedEntityId,
        },
        data: {
          lockedByUser: {
            connect: {
              id: user.id,
            },
          },
          lockedAt: new Date(),
        },
      });

      let relatedField;
      // Create the related field
      try {
        relatedField = await client.entityField.create({
          data: {
            unique: false,
            required: false,
            searchable: false,
            description: "",
            name: relatedFieldName,
            displayName: relatedFieldDisplayName,
            dataType: EnumDataType.Lookup,
            entityVersion: {
              connect: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                entityId_versionNumber: {
                  entityId: properties.relatedEntityId,
                  versionNumber: 0,
                },
              },
            },
            properties: {
              allowMultipleSelection: !properties.allowMultipleSelection,
              relatedEntityId: field.entityVersion.entity.id,
              relatedFieldId: field.permanentId,
            },
          },
        });
      } catch (error) {
        relatedField = await client.entityField.create({
          data: {
            unique: false,
            required: false,
            searchable: false,
            description: "",
            name: cuid(),
            displayName: cuid(),
            dataType: EnumDataType.Lookup,
            entityVersion: {
              connect: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                entityId_versionNumber: {
                  entityId: properties.relatedEntityId,
                  versionNumber: 0,
                },
              },
            },
            properties: {
              allowMultipleSelection: !properties.allowMultipleSelection,
              relatedEntityId: field.entityVersion.entity.id,
              relatedFieldId: field.permanentId,
            },
          },
        });
      }
      // Update the field with the related field id
      await client.entityField.update({
        where: { id: field.id },
        data: {
          properties: {
            ...properties,
            relatedFieldId: relatedField.permanentId,
          },
        },
      });
    })
  );

  await client.$disconnect();
}

main().catch(console.error);

// Execute from bash
// $ POSTGRESQL_URL=postgres://[user]:[password]@127.0.0.1:5432/app-database npx ts-node add-related-fields.ts
