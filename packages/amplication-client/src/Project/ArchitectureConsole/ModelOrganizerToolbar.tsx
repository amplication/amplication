import "./ModelOrganizerToolbar.scss";

import {
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
import { ModelChanges } from "./types";

export const CLASS_NAME = "model-organizer-toolbar";

type Props = {
  readOnly: boolean;
  hasChanges: boolean;
  changes: ModelChanges;
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

  const handleChangesDialogDismiss = useCallback(() => {
    setChangesDialog(false);
  }, [setChangesDialog]);

  return (
    <div className={CLASS_NAME}>
      <Dialog
        style={{ marginTop: "10vh" }}
        isOpen={confirmChanges}
        onDismiss={handleConfirmChangesState}
        title="Confirm Architecture Changes"
      >
        <ModelOrganizerConfirmation
          onConfirmChanges={onApplyPlan}
          onCancelChanges={handleConfirmChangesState}
          changes={changes}
        ></ModelOrganizerConfirmation>
      </Dialog>

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
            <FeatureIndicatorContainer
              featureId={BillingFeature.RedesignArchitecture}
              entitlementType={EntitlementType.Boolean}
              limitationText="Available as part of the Enterprise plan only."
            >
              <Button
                buttonStyle={EnumButtonStyle.Outline}
                onClick={handleAiClicked}
                // eventData={{
                //   eventName: AnalyticsEventNames.ImportPrismaSchemaClick,
                // }}
              >
                AI Helper
              </Button>
            </FeatureIndicatorContainer>

            {!readOnly && (
              <>
                <div className={`${CLASS_NAME}__divider`}></div>
                <ModelsTool
                  handleServiceCreated={handleServiceCreated}
                  onCancelChanges={onCancelChanges}
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
