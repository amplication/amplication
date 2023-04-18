import GitProviderConnection from "./GitProviderConnection";
import { EnumGitProvider } from "../../../models";
import "./GitProviderConnectionList.scss";

export type Props = {
  handleAddProviderClick: (data: any) => any;
};

const CLASS_NAME = "git-provider-connection-list";

export const GitProviderConnectionList: React.FC<Props> = ({
  handleAddProviderClick,
}) => {
  return (
    <div className={CLASS_NAME}>
      <GitProviderConnection
        provider={EnumGitProvider.Github}
        onSyncNewGitOrganizationClick={handleAddProviderClick}
      />
      <GitProviderConnection
        provider={EnumGitProvider.Bitbucket}
        onSyncNewGitOrganizationClick={handleAddProviderClick}
        // disabled={true}
      />
      <GitProviderConnection
        provider={EnumGitProvider.GitLab}
        onSyncNewGitOrganizationClick={handleAddProviderClick}
        comingSoon={true}
      />
    </div>
  );
};
