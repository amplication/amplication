import { EnumProvider } from '../enums/provider';

export class CreateRepositoryPushRequest {
  provider: EnumProvider;
  owner: string;
  repositoryName: string;
  branchName: string;
  commit: string;
  pushAt: Date;
  installationId: string;
}
