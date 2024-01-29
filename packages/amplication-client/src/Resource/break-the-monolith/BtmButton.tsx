import React, { useCallback, useState } from "react";
import {
  Button,
  Dialog,
  EnumButtonStyle,
  Modal,
} from "@amplication/ui/design-system";
import BreakTheMonolith from "./BreakTheMonolith";
import { useHistory } from "react-router-dom";

type Props = {
  resourceId: string;
  openInFullScreen: boolean;
  ButtonStyle?: EnumButtonStyle;
};

export const BtmButton: React.FC<Props> = ({
  resourceId,
  openInFullScreen,
  ButtonStyle = EnumButtonStyle.GradientOutline,
}) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDialogState = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    openInFullScreen && history.push("/"); // TODO: redirect to the architecture page in redesign mode
    setIsOpen(!isOpen);
  }, [openInFullScreen, history, isOpen]);

  return (
    <>
      <Button buttonStyle={ButtonStyle} onClick={handleDialogState}>
        Break the Monolith
      </Button>

      {openInFullScreen && isOpen ? (
        <Modal
          open
          onCloseEvent={handleDialogState}
          fullScreen={true}
          showCloseButton
        >
          <BreakTheMonolith
            resourceId={resourceId}
            openInFullScreen
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
