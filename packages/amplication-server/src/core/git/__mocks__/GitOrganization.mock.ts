import { EXAMPLE_DATE } from 'src/core/build/build.service.spec';
import { GitOrganization } from 'src/models/GitOrganization';
import { EnumGitOrganizationType } from '../dto/enums/EnumGitOrganizationType';
import { EnumGitProvider } from '../dto/enums/EnumGitProvider';

export const EXAMPLE_GIT_ORGANIZATION: GitOrganization = {
  name: 'exampleGitOrganization',
  createdAt: EXAMPLE_DATE,
  updatedAt: EXAMPLE_DATE,
  id: 'exampleGitOrganizationId',
  installationId: '123456',
  provider: EnumGitProvider.Github,
  type: EnumGitOrganizationType.Organization
};
