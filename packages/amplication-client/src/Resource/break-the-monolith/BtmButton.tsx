import React, { useCallback, useState } from "react";
import {
  Button,
  Dialog,
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Modal,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import BreakTheMonolith from "./BreakTheMonolith";
import { useHistory } from "react-router-dom";
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
}

type Props = {
  openInFullScreen: boolean;
  location: EnumButtonLocation;
  ButtonStyle?: EnumButtonStyle;
};

export const BtmButton: React.FC<Props> = ({
  openInFullScreen,
  location,
  ButtonStyle = EnumButtonStyle.GradientOutline,
}) => {
  const { currentResource, resources } = useAppContext();

  const history = useHistory();
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
  }, [currentResource, toggleIsOpen]);

  const onSelectMenuSelectResource = useCallback(
    (itemData: Resource) => {
      setSelectedResource(itemData);
      toggleIsOpen();
    },
    [toggleIsOpen]
  );

  const handleConfirm = useCallback(() => {
    openInFullScreen && history.push("/"); // TODO: redirect to the architecture page in redesign mode
    setIsOpen(!isOpen);

    trackEvent({
      eventName: AnalyticsEventNames.StartBreakTheMonolithClick,
      serviceName: selectedResource.name,
      location,
    });
  }, [
    selectedResource,
    history,
    isOpen,
    location,
    openInFullScreen,
    trackEvent,
  ]);

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
            handleConfirmSuggestion={handleConfirm}
          />
        </Modal>
      ) : (
        <Dialog isOpen={isOpen} onDismiss={toggleIsOpen} title="">
          <BreakTheMonolith
            resource={selectedResource}
            handleConfirmSuggestion={handleConfirm}
          />
        </Dialog>
      )}
    </>
  );
};
