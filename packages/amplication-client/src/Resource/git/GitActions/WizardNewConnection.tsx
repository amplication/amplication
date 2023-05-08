import { EnumGitProvider } from "../../../models";
import GitSyncNotes from "../GitSyncNotes";
import ProviderItem from "./ProviderItem";

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
      <ProviderItem
        onSyncNewGitOrganizationClick={onSyncNewGitOrganizationClick}
        provider={provider}
      ></ProviderItem>
      <GitSyncNotes />
    </div>
  );
}
