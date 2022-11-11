import { EnumResourceType } from '@amplication/prisma-db';
import { Resource } from '../../../models';
import { TEST_RESOURCE_ID } from './resourceId.mock';

export const TEST_SERVICE_RESOURCE_MOCK: Resource = {
  createdAt: new Date(),
  description: 'Description',
  id: TEST_RESOURCE_ID,
  name: 'test resource',
  updatedAt: new Date(),
  resourceType: EnumResourceType.Service,
  gitRepositoryOverride: false
};
export const MOCK_SERVICE_RESOURCE_WITHOUT_GITHUB_TOKEN: Resource = {
  createdAt: new Date(),
  description: 'Description',
  id: 'MOCK_SERVICE_RESOURCE_WITHOUT_GITHUB_TOKEN',
  name: 'test resource',
  updatedAt: new Date(),
  resourceType: EnumResourceType.Service,
  gitRepositoryOverride: false
};
