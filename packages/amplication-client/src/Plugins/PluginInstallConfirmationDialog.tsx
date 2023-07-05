import { Button, Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import React from "react";
import { DIALOG_CLASS_NAME } from "./PluginsCatalog";

type Props = {
  confirmInstall: boolean;
  handleDismissInstall: () => void;
};

const PluginInstallConfirmationDialog: React.FC<Props> = ({
  confirmInstall,
  handleDismissInstall,
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
          Plugin installation cannot proceed as an entity for authentication has
          not been defined. Please refer to our documentation on how to define
          an entity for authentication before attempting to install the
          authentication plugin
        </div>
        <Button
          className={`${DIALOG_CLASS_NAME}__upgrade_button`}
          buttonStyle={EnumButtonStyle.Primary}
          onClick={handleDismissInstall}
        >
          Dismiss
        </Button>
      </Dialog>
    </div>
  );
};

export default PluginInstallConfirmationDialog;
