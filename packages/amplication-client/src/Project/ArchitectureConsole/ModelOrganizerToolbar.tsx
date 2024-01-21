import "./ModelOrganizerToolbar.scss";

import {
  Dialog,
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  SearchField,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { Button } from "../../Components/Button";
import {
  EnumFlexDirection,
  FlexEnd,
} from "@amplication/ui/design-system/components/FlexItem/FlexItem";
import * as models from "../../models";
import { useCallback, useContext, useState } from "react";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  FeatureIndicatorContainer,
  EntitlementType,
} from "../../Components/FeatureIndicatorContainer";
import { BackNavigation } from "../../Components/BackNavigation";
import { AppContext } from "../../context/appContext";
import ModelOrganizerConfirmation from "./ModelOrganizerConfirmation";
import { ModelChanges } from "./types";
import RedesignResourceButton from "../../Components/RedesignResourceButton";

export const CLASS_NAME = "model-organizer-toolbar";

type Props = {
  readOnly: boolean;
  hasChanges: boolean;
  selectedResource: models.Resource;
  changes: ModelChanges;
  onApplyPlan: () => void;
  searchPhraseChanged: (searchPhrase: string) => void;
  onRedesign: (resource: models.Resource) => void;
  resources: models.Resource[];
};

export default function ModelOrganizerToolbar({
  readOnly,
  selectedResource,
  changes,
  hasChanges,
  resources,
  onApplyPlan,
  searchPhraseChanged,
  onRedesign,
}: Props) {
  const { currentWorkspace, currentProject } = useContext(AppContext);
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
          selectedResource={selectedResource}
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
        margin={EnumFlexItemMargin.Both}
      >
        <FlexItem
          itemsAlign={EnumItemsAlign.Start}
          contentAlign={EnumContentAlign.Start}
          direction={EnumFlexDirection.Column}
          margin={EnumFlexItemMargin.Both}
        >
          {readOnly ? (
            <BackNavigation
              className={`${CLASS_NAME}__backToBtn`}
              to={`/${currentWorkspace?.id}/${currentProject?.id}`}
              label="Back to service overview"
            />
          ) : (
            <Text
              textStyle={EnumTextStyle.Tag}
              textColor={EnumTextColor.ThemeRed}
            >
              {"Cancel edit"}
            </Text>
          )}
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
