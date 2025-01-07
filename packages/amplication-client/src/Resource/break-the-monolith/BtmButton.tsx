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
import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import React, { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_TEXT_END,
  DEFAULT_TEXT_START,
  DISABLED_DEFAULT_TEXT_END,
  FeatureIndicator,
} from "../../Components/FeatureIndicator";
import ResourceTypeBadge from "../../Components/ResourceTypeBadge";
import { useAppContext } from "../../context/appContext";
import {
  EnumSubscriptionPlan,
  EnumSubscriptionStatus,
  Resource,
} from "../../models";
import useModelOrganizerPersistentData from "../../Project/ArchitectureConsole/hooks/useModelOrganizerPersistentData";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { getCookie, setCookie } from "../../util/cookie";
import useAbTesting from "../../VersionControl/hooks/useABTesting";
import BreakTheMonolith from "./BreakTheMonolith";

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

const FULL_ACCESS_TEXT =
  "Get AI recommendation for breaking a service into micro-services";
const NO_ACCESS_TEXT = "Available as part of the Enterprise plan only.";

export const BtmButton: React.FC<Props> = ({
  location,
  openInFullScreen,
  autoRedirectAfterCompletion = false,
  ButtonStyle = EnumButtonStyle.GradientOutline,
  buttonText = "Break the Monolith",
  selectedEditableResource,
}) => {
  const {
    currentWorkspace,
    currentResource,
    currentProject,
    resources,
    subscriptionPlan,
    subscriptionStatus,
    isPreviewPlan,
  } = useAppContext();
  const { trackEvent } = useTracking();
  const { stigg } = useStiggContext();
  const { upgradeCtaVariationData } = useAbTesting();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const { loadPersistentData } = useModelOrganizerPersistentData(
    currentProject?.id
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [tooltipTextStart, setTooltipTextStart] = useState<string>("");
  const [tooltipTextEnd, setTooltipTextEnd] = useState<string>("");

  const [showTooltipLink, setShowTooltipLink] = useState<boolean>(true);

  const hasRedesignArchitectureFeature = stigg.getBooleanEntitlement({
    featureId: BillingFeature.RedesignArchitecture,
  }).hasAccess;

  const allowLLMFeature = currentWorkspace?.allowLLMFeatures;

  useEffect(() => {
    if (
      hasRedesignArchitectureFeature &&
      (subscriptionPlan === EnumSubscriptionPlan.Enterprise ||
        subscriptionPlan === EnumSubscriptionPlan.Team) &&
      subscriptionStatus === EnumSubscriptionStatus.Trailing
    ) {
      setTooltipTextStart(DEFAULT_TEXT_START);
      setTooltipTextEnd(DEFAULT_TEXT_END);
      setShowTooltipLink(true);
    }

    if (!hasRedesignArchitectureFeature) {
      setTooltipTextStart(NO_ACCESS_TEXT);
      setTooltipTextEnd(DISABLED_DEFAULT_TEXT_END);
      setShowTooltipLink(true);
    }

    if (hasRedesignArchitectureFeature && !allowLLMFeature) {
      setTooltipTextStart(
        "This feature is turned off because it relies on LLMs, and your workspace settings forbid their use."
      );
      setShowTooltipLink(false);
    }

    if (
      hasRedesignArchitectureFeature &&
      (((subscriptionPlan === EnumSubscriptionPlan.Enterprise ||
        subscriptionPlan === EnumSubscriptionPlan.Team) &&
        subscriptionStatus !== EnumSubscriptionStatus.Trailing) ||
        isPreviewPlan)
    ) {
      setTooltipTextStart(FULL_ACCESS_TEXT);
      setShowTooltipLink(false);
    }
  }, [
    allowLLMFeature,
    hasRedesignArchitectureFeature,
    isPreviewPlan,
    subscriptionPlan,
    subscriptionStatus,
    upgradeCtaVariationData?.linkMessage,
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
      const previewPlanCookie = getCookie("preview-user-break-monolith");
      !previewPlanCookie &&
        setCookie("changesConfirmationMessageType", "aiProcess");
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
          textStart={tooltipTextStart}
          textEnd={tooltipTextEnd}
          showTooltipLink={showTooltipLink}
          element={
            <Button
              iconPosition={EnumIconPosition.Left}
              buttonStyle={ButtonStyle}
              onClick={onButtonSelectResource}
              disabled={!hasRedesignArchitectureFeature || !allowLLMFeature}
              icon={"ai"}
            >
              {buttonText}
            </Button>
          }
        />
      ) : (
        <FeatureIndicator
          featureName={BillingFeature.RedesignArchitecture}
          textStart={tooltipTextStart}
          textEnd={tooltipTextEnd}
          showTooltipLink={showTooltipLink}
          element={
            <SelectMenu
              title={buttonText}
              buttonStyle={ButtonStyle}
              hideSelectedItemsIndication
              disabled={!hasRedesignArchitectureFeature || !allowLLMFeature}
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
                        <ResourceTypeBadge resource={resource} size="small" />
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
          setShowConfirmation(false);
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
          showCloseButton={!isPreviewPlan}
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
