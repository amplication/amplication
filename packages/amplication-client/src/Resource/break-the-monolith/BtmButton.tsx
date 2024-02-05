import React, { useCallback, useState } from "react";
import {
  Button,
  Dialog,
  EnumButtonStyle,
  Modal,
} from "@amplication/ui/design-system";
import BreakTheMonolith from "./BreakTheMonolith";
import { useHistory } from "react-router-dom";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { Resource } from "../../models";

export enum EnumButtonLocation {
  Project = "Project",
  Resource = "Resource",
  EntityList = "EntityList",
  SchemaUpload = "SchemaUpload",
}

type Props = {
  resource: Resource;
  openInFullScreen: boolean;
  location: EnumButtonLocation;
  ButtonStyle?: EnumButtonStyle;
};

export const BtmButton: React.FC<Props> = ({
  resource,
  openInFullScreen,
  location,
  ButtonStyle = EnumButtonStyle.GradientOutline,
}) => {
  const history = useHistory();
  const { trackEvent } = useTracking();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDialogState = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    openInFullScreen && history.push("/"); // TODO: redirect to the architecture page in redesign mode
    setIsOpen(!isOpen);

    trackEvent({
      eventName: AnalyticsEventNames.StartBreakTheMonolithClick,
      serviceName: resource.name,
      location,
    });
  }, [openInFullScreen, history, isOpen, trackEvent, resource.name, location]);

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
            resourceId={resource.id}
            openInFullScreen
            handleConfirmSuggestion={handleConfirm}
          />
        </Modal>
      ) : (
        <Dialog isOpen={isOpen} onDismiss={handleDialogState} title="">
          <BreakTheMonolith
            resourceId={resource.id}
            handleConfirmSuggestion={handleConfirm}
          />
        </Dialog>
      )}
    </>
  );
};
