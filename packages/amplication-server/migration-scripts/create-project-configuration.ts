import { PrismaClient, EnumResourceType, EnumBlockType } from "../src/prisma";

import { DEFAULT_RESOURCE_COLORS } from "../src/core/resource/constants";

const DEFAULT_PROJECT_CONFIGURATION_NAME = "Project Configuration";
const DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION =
  "This resource is used to store project configuration.";

const DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME =
  "Project Configuration Settings";
const DEFAULT_PROJECT_CONFIGURATION_SETTINGS_DESCRIPTION =
  "This block is used to store project configuration settings.";

const blockVersionSettings = {
  baseDirectory: "/",
};

function chunkArrayInGroups(arr, size) {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

async function main() {
  const client = new PrismaClient();

  const projects = await client.project.findMany({
    where: {
      resources: {
        none: {
          resourceType: EnumResourceType.ProjectConfiguration,
        },
      },
    },
    include: {
      resources: true,
    },
  });

  console.log(projects.length);
  let index = 1;

  const chunks = chunkArrayInGroups(projects, 500);

  for (const chunk of chunks) {
    console.log(index++);
    await migrateChunk(chunk);
  }

  async function migrateChunk(chunk) {
    const promises = chunk.map(async (project) => {
      return client.blockVersion.create({
        data: {
          versionNumber: 0,
          displayName: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME,
          description: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_DESCRIPTION,
          inputParameters: {},
          outputParameters: {},
          settings: blockVersionSettings,
          block: {
            create: {
              blockType: EnumBlockType.ProjectConfigurationSettings,
              description: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_DESCRIPTION,
              displayName: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME,
              resource: {
                create: {
                  color: DEFAULT_RESOURCE_COLORS.projectConfiguration,
                  resourceType: EnumResourceType.ProjectConfiguration,
                  description: DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION,
                  name: DEFAULT_PROJECT_CONFIGURATION_NAME,
                  project: { connect: { id: project.id } },
                },
              },
            },
          },
        },
      });
    });

    await Promise.all(promises);
  }

  await client.$disconnect();
}

main().catch(console.error);
