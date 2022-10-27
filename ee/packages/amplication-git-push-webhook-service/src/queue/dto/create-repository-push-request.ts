import { EnumProvider } from "../../git-organization/git-organization.types";


export class CreateRepositoryPushRequest {
  provider: EnumProvider;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  commit: string;
  pushedAt: Date;
  installationId: string;
  messageId: string;
}
