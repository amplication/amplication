import {
  CircularProgress,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
  HorizontalRule,
  Snackbar,
  TabContentTitle,
} from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import { formatError } from "../util/error";
import useResourceTeamAssignments from "./hooks/useResourceTeamAssignments";
import ResourceTeamAssignment from "./ResourceTeamAssignment";
import SelectTeamsButton from "./SelectTeamsButton";

type Props = {
  resourceId: string;
};
const ResourceTeamAssignments = React.memo(({ resourceId }: Props) => {
  const {
    getResourceTeamAssignmentsData,
    getResourceTeamAssignmentsError,
    getResourceTeamAssignmentsLoading,
    createTeamAssignments,
    createTeamAssignmentsError,
    createTeamAssignmentsLoading,
  } = useResourceTeamAssignments(resourceId);

  const hasError =
    Boolean(getResourceTeamAssignmentsError) ||
    Boolean(createTeamAssignmentsError);
  const errorMessage =
    formatError(getResourceTeamAssignmentsError) ||
    formatError(createTeamAssignmentsError);

  const handleAddTeams = useCallback(
    (teamIds) => {
      createTeamAssignments(resourceId, teamIds);
    },
    [createTeamAssignments, resourceId]
  );

  return (
    <>
      <FlexItem
        direction={EnumFlexDirection.Row}
        itemsAlign={EnumItemsAlign.Start}
        start={
          <>
            <TabContentTitle
              title="Project Permissions"
              subTitle="Assign permissions for this project and its resources to specific teams"
            />
            {createTeamAssignmentsLoading ||
              (getResourceTeamAssignmentsLoading && <CircularProgress />)}
          </>
        }
        end={
          <SelectTeamsButton
            buttonStyle={EnumButtonStyle.Primary}
            TeamAssignments={getResourceTeamAssignmentsData}
            onAddTeams={handleAddTeams}
          />
        }
      ></FlexItem>
      <HorizontalRule />

      {getResourceTeamAssignmentsData?.map((assignment) => (
        <ResourceTeamAssignment
          key={assignment.id}
          resourceTeamAssignment={assignment}
        />
      ))}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
});

export default ResourceTeamAssignments;
