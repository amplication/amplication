import { EnumGitProvider } from "../../../models";
import { GitProviderConnectionList } from "./GitProviderConnectionList";

type Props = {
  onSyncNewGitOrganizationClick: (data: any) => any;
  provider: EnumGitProvider;
};

export default function WizardNewConnection({
  onSyncNewGitOrganizationClick,
  provider,
}: Props) {
  return (
    <div className="auth-with-git__newConnectionBox">
      <GitProviderConnectionList />
    </div>
  );
}
