import {
  PrismaClient,
  EnumResourceType,
  EnumBlockType
} from '@amplication/prisma-db';

import { DEFAULT_RESOURCE_COLORS } from '../src/core/resource/constants';

const DEFAULT_PROJECT_CONFIGURATION_NAME = 'Project Configuration';
const DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION =
  'This resource is used to store project configuration.';

const DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME =
  'Project Configuration Settings';
const DEFAULT_PROJECT_CONFIGURATION_SETTINGS_DESCRIPTION =
  'This block is used to store project configuration settings.';

const blockVersionSettings = {
  baseDirectory: '/'
};

async function main() {
  const client = new PrismaClient();

  const projects = await client.project.findMany({
    where: {
      resources: {
        none: {
          resourceType: EnumResourceType.ProjectConfiguration
        }
      }
    },
    include: {
      resources: true
    }
  });

  const promises = projects.map(async project => {
    const newProjectConfiguration = await client.resource.create({
      data: {
        color: DEFAULT_RESOURCE_COLORS.projectConfiguration,
        resourceType: EnumResourceType.ProjectConfiguration,
        description: DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION,
        name: DEFAULT_PROJECT_CONFIGURATION_NAME,
        project: { connect: { id: project.id } }
      }
    });

    const block = await client.block.create({
      data: {
        blockType: EnumBlockType.ProjectConfigurationSettings,
        description: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_DESCRIPTION,
        displayName: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME,
        resource: { connect: { id: newProjectConfiguration.id } }
      }
    });

    const blockVersion = await client.blockVersion.create({
      data: {
        versionNumber: 0,
        displayName: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_NAME,
        description: DEFAULT_PROJECT_CONFIGURATION_SETTINGS_DESCRIPTION,
        inputParameters: {},
        outputParameters: {},
        settings: blockVersionSettings,
        block: { connect: { id: block.id } }
      }
    });
  });

  await Promise.all(promises);

  await client.$disconnect();
}

main().catch(console.error);
