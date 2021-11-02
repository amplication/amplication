import { TEST_GITHUB_TOKEN } from '../../github/__mocks__/Github';
import { App } from '../../../models';
export const APP_ID = 'appId';

export const TEST_APP_MOCK: App = {
  createdAt: new Date(),
  description: 'Description',
  id: APP_ID,
  githubSyncEnabled: true,
  name: 'test app',
  updatedAt: new Date(),
  githubToken: TEST_GITHUB_TOKEN
};
