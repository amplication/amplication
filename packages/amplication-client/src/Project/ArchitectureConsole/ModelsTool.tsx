import {
  Button,
  ConfirmationDialog,
  Dialog,
  EnumButtonStyle,
  Icon,
  Tooltip,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useState } from "react";
import { Resource } from "../../models";
import CreateResource from "./CreateResource";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { AppContext } from "../../context/appContext";

const DIRECTION = "s";
const MERGE_CONFIRM_BUTTON = { label: "Fetch updates and merge changes" };
const MERGE_DISMISS_BUTTON = { label: "Cancel" };

const CONFIRM_DISCARD_BUTTON = { label: "Discard Changes" };
const DISMISS_DISCARD_BUTTON = { label: "Dismiss" };

type Props = {
  handleServiceCreated: (newResource: Resource) => void;
  onCancelChanges: () => void;
  mergeNewResourcesChanges: () => void;
};

export default function ModelsTool({
  handleServiceCreated,
  onCancelChanges,
  mergeNewResourcesChanges,
}: Props) {
  const { trackEvent } = useTracking();
  const [newService, setNewService] = useState<boolean>(false);

  const [confirmMergeChanges, setConfirmMergeChanges] =
    useState<boolean>(false);

  const [confirmDiscardChanges, setConfirmDiscardChanges] =
    useState<boolean>(false);

  const handleNewServiceClick = useCallback(() => {
    setNewService(!newService);
  }, [newService, setNewService]);

  const handleNewCreatedServiceClick = useCallback(
    (newResource: Resource) => {
      setNewService(!newService);
      handleServiceCreated(newResource);

      trackEvent({
        eventName: AnalyticsEventNames.ModelOrganizer_AddServiceClick,
        serviceName: newResource.name,
      });
    },
    [newService, handleServiceCreated, setNewService]
  );

  const handleDiscardChangesClick = useCallback(() => {
    setConfirmDiscardChanges(false);
    onCancelChanges();
  }, [onCancelChanges]);

  const handleMergeChangesClick = useCallback(() => {
    setConfirmMergeChanges(false);
    mergeNewResourcesChanges();
  }, [mergeNewResourcesChanges]);

  return (
    <>
      <Tooltip aria-label="Discard changes" direction={DIRECTION} noDelay>
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          onClick={() => {
            setConfirmDiscardChanges(true);
          }}
        >
          <Icon icon={"trash_2"} size="small"></Icon>
        </Button>
      </Tooltip>

      <Tooltip
        aria-label="Fetch updates from server"
        direction={DIRECTION}
        noDelay
      >
        <Button
          onClick={() => {
            setConfirmMergeChanges(true);
          }}
          buttonStyle={EnumButtonStyle.Outline}
        >
          <Icon icon={"refresh_cw"} size="small"></Icon>
        </Button>
      </Tooltip>

      <Tooltip aria-label="Add new service" direction={DIRECTION} noDelay>
        <Button
          onClick={handleNewServiceClick}
          buttonStyle={EnumButtonStyle.Outline}
        >
          <Icon icon={"plus"} size="small"></Icon>
        </Button>
      </Tooltip>

      <ConfirmationDialog
        isOpen={confirmMergeChanges}
        title={`Fetch updates from server?`}
        confirmButton={MERGE_CONFIRM_BUTTON}
        dismissButton={MERGE_DISMISS_BUTTON}
        message={
          <span>
            This action will fetch updates from the server and may override
            local changes?
          </span>
        }
        onConfirm={handleMergeChangesClick}
        onDismiss={() => {
          setConfirmMergeChanges(false);
        }}
      />
      <ConfirmationDialog
        isOpen={confirmDiscardChanges}
        title={`Discard changes ?`}
        confirmButton={CONFIRM_DISCARD_BUTTON}
        dismissButton={DISMISS_DISCARD_BUTTON}
        message={<span>Are you sure you want to discard all the changes?</span>}
        onConfirm={handleDiscardChangesClick}
        onDismiss={() => {
          setConfirmDiscardChanges(false);
        }}
      />

      <Dialog
        isOpen={newService}
        onDismiss={handleNewServiceClick}
        title="New Service"
      >
        <CreateResource
          title="New Service Name"
          actionDescription="Type New Service Name"
          onSuccess={handleNewCreatedServiceClick}
        ></CreateResource>
      </Dialog>
    </>
  );
}
