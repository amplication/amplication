import { useCallback, useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import {
  ConfirmationDialog,
  Dialog,
  Snackbar,
} from "@amplication/ui/design-system";
import { useAppContext } from "../context/appContext";
import useServiceTemplate from "./hooks/useServiceTemplate";
import { formatError } from "../util/error";

type Props = {
  resourceId: string;
};

const CONFIRM_BUTTON = { icon: "check", label: "Upgrade" };
const DISMISS_BUTTON = { label: "Cancel" };

function UpgradeServiceToLatestTemplateVersionButton({ resourceId }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { currentProject } = useAppContext();

  const {
    upgradeServiceToLatestTemplateVersion,
    upgradeServiceToLatestTemplateVersionData: data,
    errorUpgradeServiceToLatestTemplateVersion: error,
    loadingUpgradeServiceToLatestTemplateVersion: loading,
  } = useServiceTemplate(currentProject);

  const errorMessage = formatError(error);

  const handleUpgradeClick = useCallback(() => {
    setIsOpen(false);
    upgradeServiceToLatestTemplateVersion(resourceId);
  }, [resourceId, upgradeServiceToLatestTemplateVersion]);

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        title="Create Service"
      >
        <ConfirmationDialog
          isOpen={isOpen}
          title={`Upgrade Service From Template`}
          confirmButton={CONFIRM_BUTTON}
          dismissButton={DISMISS_BUTTON}
          message={
            <span>
              You are about to upgrade the service from the latest template
              version.
            </span>
          }
          onConfirm={handleUpgradeClick}
          onDismiss={() => {
            setIsOpen(false);
          }}
        />
      </Dialog>

      <Button
        buttonStyle={EnumButtonStyle.Outline}
        icon="plus"
        disabled={loading}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Upgrade
      </Button>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
}

export default UpgradeServiceToLatestTemplateVersionButton;
