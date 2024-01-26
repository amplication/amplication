import "./ModelOrganizerToolbar.scss";

import {
  ConfirmationDialog,
  Dialog,
  EnumButtonStyle,
  EnumContentAlign,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
  SearchField,
} from "@amplication/ui/design-system";
import {
  EnumFlexDirection,
  FlexEnd,
} from "@amplication/ui/design-system/components/FlexItem/FlexItem";
import { BillingFeature } from "@amplication/util-billing-types";
import { useCallback, useState } from "react";
import { Button } from "../../Components/Button";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../../Components/FeatureIndicatorContainer";
import RedesignResourceButton from "../../Components/RedesignResourceButton";
import * as models from "../../models";
import ModelOrganizerConfirmation from "./ModelOrganizerConfirmation";
import ModelsTool from "./ModelsTool";
import { ModelChanges, Node } from "./types";

export const CLASS_NAME = "model-organizer-toolbar";
const CONFIRM_BUTTON = { label: "Discard Changes" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  readOnly: boolean;
  hasChanges: boolean;
  changes: ModelChanges;
  nodes: Node[];
  onApplyPlan: () => void;
  searchPhraseChanged: (searchPhrase: string) => void;
  onRedesign: (resource: models.Resource) => void;
  resources: models.Resource[];
  handleServiceCreated: (newResource: models.Resource) => void;
  onCancelChanges: () => void;
  mergeNewResourcesChanges: () => void;
};

export default function ModelOrganizerToolbar({
  readOnly,
  changes,
  hasChanges,
  nodes,
  resources,
  onApplyPlan,
  searchPhraseChanged,
  onRedesign,
  handleServiceCreated,
  onCancelChanges,
  mergeNewResourcesChanges,
}: Props) {
  const handleSearchPhraseChanged = useCallback(
    (searchPhrase: string) => {
      searchPhraseChanged(searchPhrase);
    },
    [searchPhraseChanged]
  );
  const [confirmChanges, setConfirmChanges] = useState<boolean>(false);
  const [confirmDiscardChanges, setConfirmDiscardChanges] =
    useState<boolean>(false);

  const handleConfirmChangesState = useCallback(() => {
    setConfirmChanges(!confirmChanges);
  }, [confirmChanges, setConfirmChanges]);

  const [changesDialog, setChangesDialog] = useState<boolean>(false);

  const handleAiClicked = useCallback(() => {
    if (hasChanges) {
      setChangesDialog(true);
    } else {
      //trigger AI process
    }
  }, [setChangesDialog, hasChanges]);

  const handleDiscardChangesClicked = useCallback(() => {
    setConfirmDiscardChanges(!confirmDiscardChanges);
  }, [setConfirmDiscardChanges, confirmDiscardChanges]);

  const handleChangesDialogDismiss = useCallback(() => {
    setChangesDialog(false);
  }, [setChangesDialog]);

  const handleConfirmDelete = useCallback(() => {
    setConfirmDiscardChanges(!confirmDiscardChanges);
    onCancelChanges();
  }, [confirmDiscardChanges, onCancelChanges]);

  return (
    <div className={CLASS_NAME}>
      <Dialog
        isOpen={confirmChanges}
        onDismiss={handleConfirmChangesState}
        title="Confirm Architecture Changes"
      >
        <ModelOrganizerConfirmation
          nodes={nodes}
          onConfirmChanges={onApplyPlan}
          onCancelChanges={handleConfirmChangesState}
          changes={changes}
        ></ModelOrganizerConfirmation>
      </Dialog>

      <ConfirmationDialog
        isOpen={confirmDiscardChanges}
        title={`Discard changes ?`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={<span>Are you sure you want to discard all the changes?</span>}
        onConfirm={handleConfirmDelete}
        onDismiss={handleDiscardChangesClicked}
      />

      <Dialog isOpen={changesDialog} onDismiss={handleChangesDialogDismiss}>
        <div className={`${CLASS_NAME}__changesDialog`}>
          <div className={`${CLASS_NAME}__changesDialogTitle`}>
            <span style={{ color: "#F6AA50" }}>Warning:</span>{" "}
            <span>Save Changes Before Using Amplication AI</span>
          </div>
          <div className={`${CLASS_NAME}__changesDialogDescription`}>
            <span>
              Breaking the monolith recommendation may override your existing
              changes.{" "}
            </span>
            <span>
              If you want to apply the changes, please quit and apply before
              using
            </span>
            <span>Amplication AI</span>
          </div>
          <Button onClick={handleChangesDialogDismiss}>I understand</Button>
        </div>
      </Dialog>
      <FlexItem
        itemsAlign={EnumItemsAlign.Center}
        contentAlign={EnumContentAlign.Start}
        gap={EnumGapSize.Large}
      >
        <FlexItem
          itemsAlign={EnumItemsAlign.Start}
          contentAlign={EnumContentAlign.Start}
          direction={EnumFlexDirection.Column}
        >
          <SearchField
            label="search"
            placeholder="search"
            onChange={handleSearchPhraseChanged}
          />
        </FlexItem>

        <FlexEnd>
          <FlexItem>
            {/* <FeatureIndicatorContainer //todo: return in phase 2
              featureId={BillingFeature.RedesignArchitecture}
              entitlementType={EntitlementType.Boolean}
              limitationText="Available as part of the Enterprise plan only."
            >
              <Button
                buttonStyle={EnumButtonStyle.Outline}
                onClick={handleAiClicked}
                eventData={{
                  eventName: AnalyticsEventNames.ImportPrismaSchemaClick,
                }}
              >
                AI Helper
              </Button>
            </FeatureIndicatorContainer> */}

            {!readOnly && (
              <>
                <div className={`${CLASS_NAME}__divider`}></div>
                <ModelsTool
                  handleServiceCreated={handleServiceCreated}
                  onCancelChanges={handleDiscardChangesClicked}
                  mergeNewResourcesChanges={mergeNewResourcesChanges}
                ></ModelsTool>
                <div className={`${CLASS_NAME}__divider`}></div>
                <FeatureIndicatorContainer
                  featureId={BillingFeature.RedesignArchitecture}
                  entitlementType={EntitlementType.Boolean}
                  limitationText="Available as part of the Enterprise plan only."
                >
                  <Button
                    buttonStyle={EnumButtonStyle.Primary}
                    onClick={handleConfirmChangesState}
                    // eventData={{
                    //   eventName: AnalyticsEventNames.ImportPrismaSchemaClick,
                    // }}
                    disabled={!hasChanges}
                  >
                    Apply Plan
                  </Button>
                </FeatureIndicatorContainer>
              </>
            )}
            {readOnly && (
              <RedesignResourceButton
                resources={resources}
                onSelectResource={onRedesign}
              ></RedesignResourceButton>
            )}
          </FlexItem>
        </FlexEnd>
      </FlexItem>
    </div>
  );
}
