import React, { useCallback, useState } from "react";
import { Button, Dialog, Modal } from "@amplication/ui/design-system";
import BreakTheMonolith from "./BreakTheMonolith";
import { useHistory } from "react-router-dom";

type Props = {
  resourceId: string;
  openInModal: boolean;
};

export const BtmButton: React.FC<Props> = ({ resourceId, openInModal }) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDialogState = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    openInModal && history.push("/"); // TODO: redirect to the architecture page in redesign mode
    setIsOpen(!isOpen);
  }, [openInModal, history, isOpen]);

  return (
    <>
      <Button onClick={handleDialogState}>Break</Button>

      {openInModal && isOpen ? (
        <Modal
          open
          onCloseEvent={handleDialogState}
          fullScreen={true}
          showCloseButton
        >
          <BreakTheMonolith
            resourceId={resourceId}
            openInModal
            handleConfirmSuggestion={handleConfirm}
          />
        </Modal>
      ) : (
        <Dialog isOpen={isOpen} onDismiss={handleDialogState} title="">
          <BreakTheMonolith
            resourceId={resourceId}
            handleConfirmSuggestion={handleConfirm}
          />
        </Dialog>
      )}
    </>
  );
};
