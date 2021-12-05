import { mock } from 'jest-mock-extended';
import { MOCK_GITHUB_SERVICE } from 'src/core/github/__mocks__/Github';
import { EnumSourceControlService } from '../../dto/enums/EnumSourceControlService';
import { GitServiceFactory } from './GitServiceFactory';

export const MOCK_GIT_SERVICE_FACTORY = mock<GitServiceFactory>();

MOCK_GIT_SERVICE_FACTORY.getService
  .calledWith(EnumSourceControlService.Github)
  .mockReturnValue(MOCK_GITHUB_SERVICE);
