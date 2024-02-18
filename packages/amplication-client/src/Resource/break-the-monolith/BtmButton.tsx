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
  Architecture = "Architecture",
}

type Props = {
  location: EnumButtonLocation;
  openInFullScreen: boolean;
  autoRedirectAfterCompletion?: boolean;
  ButtonStyle?: EnumButtonStyle;
  buttonText?: string;
  resource?: Resource;
};

export const BtmButton: React.FC<Props> = ({
  location,
  openInFullScreen,
  autoRedirectAfterCompletion = false,
  ButtonStyle = EnumButtonStyle.GradientOutline,
  buttonText = "Break the Monolith",
  resource,
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

  const selectResourceToBreak = useCallback(
    (resource: Resource) => {
      setSelectedResource(resource);
      toggleIsOpen();

      trackEvent({
        eventName: AnalyticsEventNames.StartBreakTheMonolithClick,
        serviceName:
          selectedResource?.name ?? currentResource?.name ?? resource.name,
        location,
      });
    },
    [currentResource, location, selectedResource, toggleIsOpen, trackEvent]
  );

  const onButtonSelectResource = useCallback(() => {
    selectResourceToBreak(currentResource ?? resource);
  }, [currentResource, selectResourceToBreak, resource]);

  const onSelectMenuSelectResource = useCallback(
    (itemData: Resource) => {
      selectResourceToBreak(itemData);
    },
    [selectResourceToBreak]
  );

  const handleConfirm = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <>
      {currentResource || resource ? (
        <Button buttonStyle={ButtonStyle} onClick={onButtonSelectResource}>
          {buttonText}
        </Button>
      ) : (
        <SelectMenu
          title={buttonText}
          buttonStyle={ButtonStyle}
          hideSelectedItemsIndication
        >
          <SelectMenuModal align="right" withCaret>
            <SelectMenuList>
              {resources.map((resource) => (
                <SelectMenuItem
                  key={resource.id}
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
