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
        title="Restore 'User' Entity?"
        className={DIALOG_CLASS_NAME}
        isOpen={confirmInstall}
        onDismiss={handleDismissInstall}
      >
        <div className={`${DIALOG_CLASS_NAME}__message__keep_building`}>
          We've noticed you're creating a new 'User' entity. This entity is used
          by the Authentication plugin.
        </div>
        <div className={`${DIALOG_CLASS_NAME}__message__keep_building`}>
          Restore the Default 'User' Entity - This will re-establish the
          original 'User' entity provided by Amplication, including all
          associated settings and functionalities.
        </div>
        <div className={`${DIALOG_CLASS_NAME}__dialog_btn`}>
          <Button
            className={`${DIALOG_CLASS_NAME}__upgrade_button`}
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleCreateDefaultEntitiesConfirmation}
          >
            Restore Default
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default PluginInstallConfirmationDialog;
