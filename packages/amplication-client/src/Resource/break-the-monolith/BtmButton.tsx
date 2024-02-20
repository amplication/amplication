import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  ConfirmationDialog,
  Dialog,
  EnumButtonStyle,
  EnumIconPosition,
  EnumItemsAlign,
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
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { useAppContext } from "../../context/appContext";
import {
  EnumSubscriptionPlan,
  EnumSubscriptionStatus,
  Resource,
} from "../../models";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";
import useModelOrganizerPersistentData from "../../Project/ArchitectureConsole/hooks/useModelOrganizerPersistentData";
import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import {
  FeatureIndicator,
  tooltipDefaultText,
  tooltipDefaultTextUpgrade,
} from "../../Components/FeatureIndicator";

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
  selectedEditableResource?: Resource;
};

const CONFIRM_BUTTON = { icon: "", label: "Override" };
const DISMISS_BUTTON = { label: "Dismiss" };

export const BtmButton: React.FC<Props> = ({
  location,
  openInFullScreen,
  autoRedirectAfterCompletion = false,
  ButtonStyle = EnumButtonStyle.GradientOutline,
  buttonText = "Break the Monolith",
  selectedEditableResource,
}) => {
  const {
    currentResource,
    currentProject,
    resources,
    subscriptionPlan,
    subscriptionStatus,
    isPreviewPlan,
  } = useAppContext();
  const { trackEvent } = useTracking();
  const { stigg } = useStiggContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const { loadPersistentData } = useModelOrganizerPersistentData(
    currentProject?.id
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [tooltipText, setTooltipText] = useState<string>("");
  const [upgradeTooltipText, setUpgradeTooltipText] = useState<string>("");

  const hasRedesignArchitectureFeature = stigg.getBooleanEntitlement({
    featureId: BillingFeature.RedesignArchitecture,
  }).hasAccess;

  useEffect(() => {
    if (
      hasRedesignArchitectureFeature &&
      subscriptionPlan === EnumSubscriptionPlan.Enterprise &&
      subscriptionStatus === EnumSubscriptionStatus.Trailing
    ) {
      setTooltipText(tooltipDefaultText);
      setUpgradeTooltipText(tooltipDefaultTextUpgrade);
    }

    if (!hasRedesignArchitectureFeature) {
      setTooltipText("Available as part of the Enterprise plan only.");
      setUpgradeTooltipText(tooltipDefaultTextUpgrade);
    }

    if (
      hasRedesignArchitectureFeature &&
      ((subscriptionPlan === EnumSubscriptionPlan.Enterprise &&
        subscriptionStatus !== EnumSubscriptionStatus.Trailing) ||
        isPreviewPlan)
    ) {
      setTooltipText(
        "Get AI recommendation for breaking a service into micro-services"
      );
      setUpgradeTooltipText("");
    }
  }, [
    hasRedesignArchitectureFeature,
    isPreviewPlan,
    subscriptionPlan,
    subscriptionStatus,
  ]);

  const toggleIsOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const selectResourceToBreak = useCallback(
    (resource: Resource, overrideChangesConfirmed = false) => {
      setSelectedResource(resource);

      if (!overrideChangesConfirmed) {
        const savedData = loadPersistentData();

        if (
          savedData &&
          (savedData.changes?.movedEntities?.length > 0 ||
            savedData.changes?.newServices?.length > 0)
        ) {
          setShowConfirmation(true);
          return;
        }
      }

      toggleIsOpen();

      trackEvent({
        eventName: AnalyticsEventNames.StartBreakTheMonolithClick,
        serviceName:
          selectedResource?.name ??
          currentResource?.name ??
          selectedEditableResource?.name,
        location,
      });
    },
    [
      currentResource?.name,
      loadPersistentData,
      location,
      selectedEditableResource?.name,
      selectedResource?.name,
      toggleIsOpen,
      trackEvent,
    ]
  );

  const onButtonSelectResource = useCallback(() => {
    selectResourceToBreak(currentResource ?? selectedEditableResource);
  }, [currentResource, selectResourceToBreak, selectedEditableResource]);

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
      {currentResource || selectedEditableResource ? (
        <FeatureIndicator
          featureName={BillingFeature.RedesignArchitecture}
          text={tooltipText}
          linkText={upgradeTooltipText}
          element={
            <Button
              iconPosition={EnumIconPosition.Left}
              buttonStyle={ButtonStyle}
              onClick={onButtonSelectResource}
              disabled={!hasRedesignArchitectureFeature}
              icon={"ai"}
            >
              {buttonText}
            </Button>
          }
        />
      ) : (
        <FeatureIndicator
          featureName={BillingFeature.RedesignArchitecture}
          text={tooltipText}
          linkText={upgradeTooltipText}
          element={
            <SelectMenu
              title={buttonText}
              buttonStyle={ButtonStyle}
              hideSelectedItemsIndication
              disabled={!hasRedesignArchitectureFeature}
              icon={"ai"}
              buttonIconPosition={EnumIconPosition.Left}
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
          }
        />
      )}

      <ConfirmationDialog
        isOpen={showConfirmation}
        title={`Override Architecture Changes ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={
          <Text textStyle={EnumTextStyle.Tag}>
            <div>
              There are changes made in the architecture console. If you
              continue with the Break the Monolith process, the current changes
              will be overridden.
            </div>
            <div>
              Are you sure you want to override the current architecture
              changes?
            </div>
          </Text>
        }
        onConfirm={() => {
          selectResourceToBreak(selectedResource, true);
        }}
        onDismiss={() => {
          setShowConfirmation(false);
        }}
      />

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
