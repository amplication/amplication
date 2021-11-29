import { App } from '../../../models';
import { TEST_APP_ID } from './appId.mock';

export const TEST_APP_MOCK: App = {
  createdAt: new Date(),
  description: 'Description',
  id: TEST_APP_ID,
  githubSyncEnabled: true,
  name: 'test app',
  updatedAt: new Date(),
  githubToken: 'GITHUB_TOKEN'
};
export const MOCK_APP_WITHOUT_GITHUB_TOKEN: App = {
  createdAt: new Date(),
  description: 'Description',
  id: 'MOCK_APP_WITHOUT_GITHUB_TOKEN',
  githubSyncEnabled: false,
  name: 'test app',
  updatedAt: new Date(),
  githubToken: null
};
