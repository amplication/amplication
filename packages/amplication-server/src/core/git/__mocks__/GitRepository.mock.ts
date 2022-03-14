import { EXAMPLE_DATE } from 'src/core/build/build.service.spec';
import { GitRepository } from 'src/models/GitRepository';
import { EXAMPLE_GIT_ORGANIZATION } from './GitOrganization.mock';

export const EXAMPLE_GIT_REPOSITORY: GitRepository = {
  id: 'exampleGitRepositoryId',
  name: 'repositoryTest',
  gitOrganizationId: 'exampleGitOrganizationId',
  createdAt: EXAMPLE_DATE,
  updatedAt: EXAMPLE_DATE,
  gitOrganization: EXAMPLE_GIT_ORGANIZATION
};
