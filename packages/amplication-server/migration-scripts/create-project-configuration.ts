import {
  PrismaClient,
  EnumResourceType,
  Resource,
  Block
} from '@amplication/prisma-db';
import { ProjectConfigurationExistError } from '../src/core/resource/errors/ProjectConfigurationExistError';
import { DEFAULT_RESOURCE_COLORS } from '../src/core/resource/constants';
import { isEmpty } from 'lodash';

import { ProjectConfigurationSettings } from '../src/core/projectConfigurationSettings/dto/ProjectConfigurationSettings';
import { ProjectConfigurationSettingsExistError } from '../src/core/projectConfigurationSettings/errors/ProjectConfigurationSettingsExistError';

import { EnumBlockType } from '../src/enums/EnumBlockType';

import { DEFAULT_PROJECT_CONFIGURATION_SETTINGS } from '../src/core/projectConfigurationSettings/projectConfigurationSettings.service';

import { IBlock } from '../src/models';

import { ConflictException, NotFoundException } from '@nestjs/common';
import { FindOneArgs } from '../src/dto';
import { FindManyBlockTypeArgs } from '../src/core/block/dto';

const DEFAULT_PROJECT_CONFIGURATION_NAME = 'Project Configuration';
const DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION =
  'This resource is used to store project configuration.';

async function main() {
  const client = new PrismaClient();

  await client.$disconnect();
}

async function createProjectConfiguration(
  projectId: string,
  userId: string
): Promise<Resource> {
  const existingProjectConfiguration = await this.prisma.resource.findFirst({
    where: { projectId, resourceType: EnumResourceType.ProjectConfiguration }
  });

  if (!isEmpty(existingProjectConfiguration)) {
    throw new ProjectConfigurationExistError();
  }

  const newProjectConfiguration = await this.prisma.resource.create({
    data: {
      color: DEFAULT_RESOURCE_COLORS.projectConfiguration,
      resourceType: EnumResourceType.ProjectConfiguration,
      description: DEFAULT_PROJECT_CONFIGURATION_DESCRIPTION,
      name: DEFAULT_PROJECT_CONFIGURATION_NAME,
      project: { connect: { id: projectId } }
    }
  });

  await createDefaultProjectConfigurationSettings(newProjectConfiguration.id, userId);
  return newProjectConfiguration;
}

async function createDefaultProjectConfigurationSettings(
  resourceId: string,
  userId: string
): Promise<ProjectConfigurationSettings> {
  const existingProjectConfigurationSettings = findOneProjectConfigurationSettings({
    where: { id: resourceId }
  });

  if (!isEmpty(existingProjectConfigurationSettings)) {
    throw new ProjectConfigurationSettingsExistError();
  }

  const projectConfigurationSettings = await createBlock(
    {
      data: {
        resource: {
          connect: {
            id: resourceId
          }
        },
        ...DEFAULT_PROJECT_CONFIGURATION_SETTINGS
      }
    },
    userId
  );
  return projectConfigurationSettings;
}

async function findOneProjectConfigurationSettings(args: FindOneArgs): Promise<ProjectConfigurationSettings> {
  const [
    projectConfigurationSettings
  ] = await findManyBlocksByBlockType(
    {
      where: {
        resource: {
          id: args.where.id
        }
      }
    },
    EnumBlockType.ProjectConfigurationSettings
  );
  return projectConfigurationSettings;
}

async function findManyBlocksByBlockType(
  args: FindManyBlockTypeArgs,
  blockType: EnumBlockType
): Promise<any[]> {
  const blocks = this.prisma.block.findMany({
    ...args,
    where: {
      ...args.where,
      blockType: { equals: blockType }
    },
    include: {
      versions: {
        where: {
          versionNumber: 0
        }
      },
      parentBlock: true
    }
  });
  return (await blocks).map(block => {
    const [version] = block.versions;
    return this.versionToIBlock({ ...version, block });
  });
}

async function createBlock(args: any, userId: string): Promise<any> {
  const {
    displayName,
    description,
    resource: resourceConnect,
    blockType,
    parentBlock: parentBlockConnect,
    inputParameters,
    outputParameters,
    ...settings
  } = args.data;

  let parentBlock: Block | null = null;

  if (parentBlockConnect?.connect?.id) {
    // validate that the parent block is from the same resource, and that the link between the two types is allowed
    parentBlock = await this.resolveParentBlock(
      parentBlockConnect.connect.id,
      resourceConnect.connect.id
    );
  }

  // validate the parent block type
  if (
    parentBlock &&
    !this.canUseParentType(
      EnumBlockType[blockType],
      EnumBlockType[parentBlock.blockType]
    )
  ) {
    throw new ConflictException(
      parentBlock.blockType
        ? `Block type ${parentBlock.blockType} is not allowed as a parent for block type ${blockType}`
        : `Block type ${blockType} cannot be created without a parent block`
    );
  }

  const blockData = {
    displayName: displayName,
    description: description,
    resource: resourceConnect,
    blockType: blockType,
    parentBlock: parentBlockConnect,
    lockedAt: new Date(),
    lockedByUser: {
      connect: {
        id: userId
      }
    }
  };

  const versionData = {
    displayName: displayName,
    description: description,
    versionNumber: 0,
    inputParameters: { params: inputParameters },
    outputParameters: {
      params: outputParameters
    },
    settings
  };

  // Create first entry on BlockVersion by default when new block is created
  const version = await this.prisma.blockVersion.create({
    data: {
      ...versionData,
      commit: undefined,
      block: {
        create: blockData
      }
    },
    include: {
      block: {
        include: {
          resource: true,
          parentBlock: true
        }
      }
    }
  });

  const block: IBlock = {
    displayName,
    description,
    blockType: blockData.blockType,
    id: version.block.id,
    createdAt: version.block.createdAt,
    updatedAt: version.block.updatedAt,
    parentBlock: version.block.parentBlock || null,
    versionNumber: versionData.versionNumber,
    inputParameters: inputParameters,
    outputParameters: outputParameters
  };

  return {
    ...block,
    ...settings
  };
}

async function resolveParentBlock(
  blockId: string,
  resourceId: string
): Promise<Block> {
  const matchingBlocks = await this.prisma.block.findMany({
    where: {
      id: blockId,
      resourceId
    }
  });
  if (matchingBlocks.length === 0) {
    throw new NotFoundException(`Can't find parent block with ID ${blockId}`);
  }
  if (matchingBlocks.length === 1) {
    const [block] = matchingBlocks;

    return block;
  }
  throw new Error('Unexpected length of matchingBlocks');
}

main().catch(console.error);
