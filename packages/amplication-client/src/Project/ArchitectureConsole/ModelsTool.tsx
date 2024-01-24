import {
  Button,
  Dialog,
  EnumButtonStyle,
  Icon,
  Tooltip,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { Resource } from "../../models";
import CreateResource from "./CreateResource";

const DIRECTION = "s";

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
  const [newService, setNewService] = useState<boolean>(false);
  const handleNewServiceClick = useCallback(() => {
    setNewService(!newService);
  }, [newService, setNewService]);

  const handleNewCreatedServiceClick = useCallback(
    (newResource: Resource) => {
      setNewService(!newService);
      handleServiceCreated(newResource);
    },
    [newService, handleServiceCreated, setNewService]
  );

  return (
    <>
      <Tooltip aria-label="Discard changes" direction={DIRECTION} noDelay>
        <Button buttonStyle={EnumButtonStyle.Outline} onClick={onCancelChanges}>
          <Icon icon={"trash_2"} size="small"></Icon>
        </Button>
      </Tooltip>

      <Tooltip
        aria-label="Fetch updates from server"
        direction={DIRECTION}
        noDelay
      >
        <Button
          onClick={mergeNewResourcesChanges}
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
