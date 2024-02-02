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
import { useCallback, useEffect, useState } from "react";
import BetaFeatureTag from "../../Components/BetaFeatureTag";
import { Button } from "../../Components/Button";
import RedesignResourceButton from "../../Components/RedesignResourceButton";
import * as models from "../../models";
import ModelOrganizerConfirmation from "./ModelOrganizerConfirmation";
import ModelsTool from "./ModelsTool";
import { ModelChanges, Node } from "./types";

export const CLASS_NAME = "model-organizer-toolbar";
const CONFIRM_BUTTON = { label: "Discard Changes" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  redesignMode: boolean;
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
  loadingCreateResourceAndEntities: boolean;
  createEntitiesError: boolean;
};

export default function ModelOrganizerToolbar({
  redesignMode,
  changes,
  hasChanges,
  nodes,
  resources,
  loadingCreateResourceAndEntities,
  createEntitiesError,
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
  const [changesDialog, setChangesDialog] = useState<boolean>(false);
  const [createError, setCreateError] = useState<boolean>(false);

  const [confirmDiscardChanges, setConfirmDiscardChanges] =
    useState<boolean>(false);

  const handleConfirmChangesState = useCallback(() => {
    setConfirmChanges(!confirmChanges);
    setCreateError(false);
  }, [confirmChanges, setConfirmChanges]);

  useEffect(() => {
    setCreateError(createEntitiesError);
  }, [createEntitiesError, setCreateError]);

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
        title="Apply Changes"
      >
        <ModelOrganizerConfirmation
          nodes={nodes}
          onConfirmChanges={onApplyPlan}
          onCancelChanges={handleConfirmChangesState}
          changes={changes}
          createEntitiesError={createError}
          loadingCreateResourceAndEntities={loadingCreateResourceAndEntities}
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
          itemsAlign={EnumItemsAlign.Center}
          contentAlign={EnumContentAlign.Start}
          direction={EnumFlexDirection.Row}
        >
          <SearchField
            label="search"
            placeholder="search"
            onChange={handleSearchPhraseChanged}
          />
        </FlexItem>

        <FlexEnd>
          <FlexItem itemsAlign={EnumItemsAlign.Center}>
            <BetaFeatureTag></BetaFeatureTag>

            {redesignMode && (
              <>
                <div className={`${CLASS_NAME}__divider`}></div>
                <ModelsTool
                  handleServiceCreated={handleServiceCreated}
                  onCancelChanges={handleDiscardChangesClicked}
                  mergeNewResourcesChanges={mergeNewResourcesChanges}
                ></ModelsTool>
                <div className={`${CLASS_NAME}__divider`}></div>

                <Button
                  buttonStyle={EnumButtonStyle.Primary}
                  onClick={handleConfirmChangesState}
                  disabled={!hasChanges}
                >
                  Apply Plan
                </Button>
              </>
            )}
            {!redesignMode && (
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
