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
import { useCallback, useEffect, useState } from "react";
import BetaFeatureTag from "../../Components/BetaFeatureTag";
import { Button } from "../../Components/Button";
import RedesignResourceButton from "../../Components/RedesignResourceButton";
import * as models from "../../models";
import ModelOrganizerConfirmation from "./ModelOrganizerConfirmation";
import ModelsTool from "./ModelsTool";
import { ModelChanges, Node } from "./types";
import { formatError } from "../../util/error";

export const CLASS_NAME = "model-organizer-toolbar";

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
  applyChangesLoading: boolean;
  applyChangesError: any;
  applyChangesData: models.UserAction;
};

export default function ModelOrganizerToolbar({
  redesignMode,
  changes,
  hasChanges,
  nodes,
  resources,
  applyChangesLoading,
  applyChangesError,
  applyChangesData,
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
  const [applyChangesErrorMessage, setApplyChangesErrorMessage] = useState<
    string | null
  >(null);

  const handleConfirmChangesState = useCallback(() => {
    setConfirmChanges(!confirmChanges);
    setApplyChangesErrorMessage(null);
  }, [confirmChanges, setConfirmChanges]);

  useEffect(() => {
    setApplyChangesErrorMessage(formatError(applyChangesError));
  }, [applyChangesError]);

  const handleChangesDialogDismiss = useCallback(() => {
    setChangesDialog(false);
  }, [setChangesDialog]);

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
          applyChangesErrorMessage={applyChangesErrorMessage}
          applyChangesLoading={applyChangesLoading}
          applyChangesData={applyChangesData}
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
                  onCancelChanges={onCancelChanges}
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
