import { RemoteGitOrganization } from '../Dto/entities/RemoteGitOrganization';
import { EnumGitOrganizationType } from '../Dto/enums/EnumGitOrganizationType';

export const TEST_GIT_REMOTE_ORGANIZATION: RemoteGitOrganization = {
  name: 'testGitRemoteOrganization',
  type: EnumGitOrganizationType.Organization
};
