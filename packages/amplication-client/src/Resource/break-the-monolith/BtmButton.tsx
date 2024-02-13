import React, { useCallback, useState } from "react";
import {
  Button,
  Dialog,
  EnumButtonStyle,
  EnumItemsAlign,
  FlexItem,
  Icon,
  Modal,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import BreakTheMonolith from "./BreakTheMonolith";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { useAppContext } from "../../context/appContext";
import { Resource } from "../../models";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";

export enum EnumButtonLocation {
  Project = "Project",
  Resource = "Resource",
  EntityList = "EntityList",
  SchemaUpload = "SchemaUpload",
  PreviewBtm = "PreviewBtm",
}

type Props = {
  location: EnumButtonLocation;
  openInFullScreen: boolean;
  autoRedirectAfterCompletion?: boolean;
  ButtonStyle?: EnumButtonStyle;
};

export const BtmButton: React.FC<Props> = ({
  location,
  openInFullScreen,
  autoRedirectAfterCompletion = false,
  ButtonStyle = EnumButtonStyle.GradientOutline,
}) => {
  const { currentResource, resources } = useAppContext();
  const { trackEvent } = useTracking();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );

  const toggleIsOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const onButtonSelectResource = useCallback(() => {
    setSelectedResource(currentResource);
    toggleIsOpen();

    trackEvent({
      eventName: AnalyticsEventNames.StartBreakTheMonolithClick,
      serviceName: selectedResource?.name ?? currentResource?.name,
      location,
    });
  }, [currentResource, location, selectedResource, toggleIsOpen, trackEvent]);

  const onSelectMenuSelectResource = useCallback(
    (itemData: Resource) => {
      setSelectedResource(itemData);
      toggleIsOpen();

      trackEvent({
        eventName: AnalyticsEventNames.StartBreakTheMonolithClick,
        serviceName: selectedResource?.name ?? currentResource?.name,
        location,
      });
    },
    [location, selectedResource, currentResource, toggleIsOpen, trackEvent]
  );

  const handleConfirm = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <>
      {currentResource ? (
        <Button buttonStyle={ButtonStyle} onClick={onButtonSelectResource}>
          Break the Monolith
        </Button>
      ) : (
        <SelectMenu
          title="Break the Monolith"
          buttonStyle={ButtonStyle}
          hideSelectedItemsIndication
        >
          <SelectMenuModal align="right" withCaret>
            <SelectMenuList>
              {resources.map((resource) => (
                <SelectMenuItem
                  closeAfterSelectionChange
                  itemData={resource}
                  onSelectionChange={onSelectMenuSelectResource}
                >
                  <FlexItem
                    itemsAlign={EnumItemsAlign.Center}
                    end={<Icon icon={"app-settings"} size="xsmall"></Icon>}
                  >
                    <ResourceCircleBadge
                      type={resource.resourceType}
                      size="small"
                    />
                    <span>{resource.name}</span>
                  </FlexItem>
                </SelectMenuItem>
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      )}

      {openInFullScreen && isOpen ? (
        <Modal
          open
          onCloseEvent={toggleIsOpen}
          fullScreen={true}
          showCloseButton
        >
          <BreakTheMonolith
            resource={selectedResource}
            openInFullScreen
            onComplete={handleConfirm}
            autoRedirectAfterCompletion={autoRedirectAfterCompletion}
          />
        </Modal>
      ) : (
        <Dialog isOpen={isOpen} onDismiss={toggleIsOpen} title="">
          <BreakTheMonolith
            resource={selectedResource}
            onComplete={handleConfirm}
            autoRedirectAfterCompletion={autoRedirectAfterCompletion}
          />
        </Dialog>
      )}
    </>
  );
};
