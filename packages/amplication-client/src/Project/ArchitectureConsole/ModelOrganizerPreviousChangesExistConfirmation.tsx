import { ConfirmationDialog } from "@amplication/ui/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./CreateApplyChangesLoader.scss";
import { ModelChanges } from "./types";
import { expireCookie, getCookie } from "../../util/cookie";

type Props = {
  changes: ModelChanges;
};

const manualMessage = `Your architecture tweaks are ready to be applied, allowing Amplication to generate its code.
To reset or fetch updates not in the current state, use the buttons in the top toolbar.`;
const AIMessage = `The suggested updates to the architecture, proposed by our AI, are now available for your review. Once ready, you can apply the changes, allowing Amplication to generate its corresponding code. To reset or fetch updates not in the current state, use the buttons in the top toolbar.`;

const ModelOrganizerPreviousChangesExistConfirmation = ({ changes }: Props) => {
  const [showDialog, setShowDialog] = useState<boolean | null>(false);

  const message = useMemo(() => {
    const changesConfirmationMessageType = getCookie(
      "changesConfirmationMessageType"
    );

    if (changes.movedEntities?.length > 0 || changes.newServices?.length > 0) {
      if (!changesConfirmationMessageType) return null;
      if (changesConfirmationMessageType === "manual") return manualMessage;
      if (changesConfirmationMessageType === "aiProcess") return AIMessage;
    }
  }, [changes]);

  useEffect(() => {
    if (!message) return;

    setShowDialog(true);
  }, [changes, message]);

  const onApplyChangesConfirmationClicked = useCallback(() => {
    setShowDialog(false);
    expireCookie("changesConfirmationMessageType");
  }, [setShowDialog]);

  return (
    <ConfirmationDialog
      isOpen={showDialog}
      onDismiss={onApplyChangesConfirmationClicked}
      message={message}
      confirmButton={{ label: "Got it" }}
      onConfirm={onApplyChangesConfirmationClicked}
    ></ConfirmationDialog>
  );
};

export default ModelOrganizerPreviousChangesExistConfirmation;
