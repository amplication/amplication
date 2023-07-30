import { Button, Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import React from "react";
import { DIALOG_CLASS_NAME } from "./PluginsCatalog";

type Props = {
  confirmInstall: boolean;
  handleDismissInstall: () => void;
  handleCreateDefaultEntitiesConfirmation: () => void;
};

const PluginInstallConfirmationDialog: React.FC<Props> = ({
  confirmInstall,
  handleDismissInstall,
  handleCreateDefaultEntitiesConfirmation,
}: Props) => {
  return (
    <div>
      <Dialog
        title=""
        className={DIALOG_CLASS_NAME}
        isOpen={confirmInstall}
        onDismiss={handleDismissInstall}
      >
        <div className={`${DIALOG_CLASS_NAME}__message__keep_building`}>
          Plugin installation cannot proceed without an entity defined for
          authentication
        </div>
        <div className={`${DIALOG_CLASS_NAME}__dialog_btn`}>
          <Button
            className={`${DIALOG_CLASS_NAME}__upgrade_button`}
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleCreateDefaultEntitiesConfirmation}
          >
            Create 'User' entity
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default PluginInstallConfirmationDialog;
