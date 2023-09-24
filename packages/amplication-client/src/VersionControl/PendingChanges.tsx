import {
  EnumFlexItemMargin,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  Text,
  Tooltip,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback, useContext, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { formatError } from "../util/error";
import Commit from "./Commit";
import DiscardChanges from "./DiscardChanges";

import usePendingChanges from "../Workspaces/hooks/usePendingChanges";
import { AppContext } from "../context/appContext";

const CLASS_NAME = "pending-changes";

type Props = {
  projectId: string;
};

const PendingChanges = ({ projectId }: Props) => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState<boolean>(false);
  const history = useHistory();
  const { currentWorkspace, currentProject, pendingChanges, currentResource } =
    useContext(AppContext);

  const entityMatch = useRouteMatch<{
    workspace: string;
    project: string;
    resource: string;
    entity: string;
  }>("/:workspace/:project/:resource/entities/:entity");
  const {
    pendingChangesDataError,
    pendingChangesIsError,
    pendingChangesDataLoading,
  } = usePendingChanges(currentProject);
  const handleToggleDiscardDialog = useCallback(() => {
    setDiscardDialogOpen(!discardDialogOpen);
  }, [discardDialogOpen, setDiscardDialogOpen]);

  const handleDiscardDialogCompleted = useCallback(() => {
    setDiscardDialogOpen(false);
    if (entityMatch) {
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/entities`
      );
    }
  }, [currentResource, currentProject, currentWorkspace, entityMatch]);

  const errorMessage = formatError(pendingChangesDataError);

  const noChanges = isEmpty(pendingChanges);

  return (
    <div className={CLASS_NAME}>
      <FlexItem margin={EnumFlexItemMargin.Bottom}>
        <FlexItem.FlexStart>
          <Text textStyle={EnumTextStyle.Tag}>
            <Text textStyle={EnumTextStyle.Tag}>Changes&nbsp;</Text>
            <Text
              textColor={
                pendingChanges.length
                  ? EnumTextColor.ThemeOrange
                  : EnumTextColor.Black20
              }
              textStyle={EnumTextStyle.Tag}
            >
              {pendingChanges.length}
            </Text>
          </Text>
        </FlexItem.FlexStart>
        <FlexItem.FlexEnd>
          <DiscardChanges
            isOpen={discardDialogOpen}
            projectId={projectId}
            onComplete={handleDiscardDialogCompleted}
            onDismiss={handleToggleDiscardDialog}
          />

          <Tooltip aria-label={"Discard Pending Changes"} direction="nw">
            <Button
              buttonStyle={EnumButtonStyle.Text}
              onClick={handleToggleDiscardDialog}
              disabled={pendingChangesDataLoading || noChanges}
              icon="trash_2"
            />
          </Tooltip>
        </FlexItem.FlexEnd>
      </FlexItem>

      <Commit projectId={projectId} noChanges={noChanges} />

      <Snackbar open={Boolean(pendingChangesIsError)} message={errorMessage} />
    </div>
  );
};

export default PendingChanges;
