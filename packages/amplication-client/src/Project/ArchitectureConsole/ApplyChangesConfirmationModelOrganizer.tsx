import { ConfirmationDialog } from "@amplication/ui/design-system";
import { useCallback, useEffect, useState } from "react";
import "./CreateApplyChangesLoader.scss";
import { ModelChanges } from "./types";

type Props = {
  changes: ModelChanges;
};

const ApplyChangesConfirmationModelOrganizer = ({ changes }: Props) => {
  const [confirmApplyChangesDialog, setConfirmApplyChangesDialog] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    if (
      confirmApplyChangesDialog === null &&
      (changes?.movedEntities?.length > 0 || changes?.newServices?.length > 0)
    )
      setConfirmApplyChangesDialog(true);
  }, [confirmApplyChangesDialog, changes]);

  const onApplyChangesConfirmationClicked = useCallback(() => {
    setConfirmApplyChangesDialog(false);
  }, [setConfirmApplyChangesDialog]);

  return (
    <ConfirmationDialog
      isOpen={confirmApplyChangesDialog}
      onDismiss={onApplyChangesConfirmationClicked}
      message={`Your architecture tweaks are ready to be applied, allowing Amplication to generate its code.
    To reset or fetch updates not in the current state, use the buttons in the top toolbar.`}
      confirmButton={{ label: "Got it" }}
      onConfirm={onApplyChangesConfirmationClicked}
    ></ConfirmationDialog>
  );
};

export default ApplyChangesConfirmationModelOrganizer;
