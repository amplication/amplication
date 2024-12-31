import { useMutation, useQuery } from "@apollo/client";
import * as models from "../../models";
import {
  GET_RESOURCE_TEAM_ASSIGNMENTS,
  ADD_ROLES_TO_TEAM_ASSIGNMENT,
  REMOVE_ROLES_FROM_TEAM_ASSIGNMENT,
  CREATE_TEAM_ASSIGNMENTS,
  DELETE_TEAM_ASSIGNMENT,
} from "../queries/teamsAssignmentQueries";
import { useCallback } from "react";

const useResourceTeamAssignments = (resourceId?: string) => {
  const {
    data: getResourceTeamAssignmentsData,
    error: getResourceTeamAssignmentsError,
    loading: getResourceTeamAssignmentsLoading,
    refetch: getResourceTeamAssignmentsRefetch,
  } = useQuery<{
    resource: models.Resource;
  }>(GET_RESOURCE_TEAM_ASSIGNMENTS, {
    variables: {
      resourceId,
    },
    skip: !resourceId,
  });

  const [
    createTeamAssignmentsInternal,
    {
      error: createTeamAssignmentsError,
      loading: createTeamAssignmentsLoading,
    },
  ] = useMutation<{
    createTeamAssignments: models.TeamAssignment[];
  }>(CREATE_TEAM_ASSIGNMENTS, {});

  const createTeamAssignments = useCallback(
    (resourceId: string, teamIds: string[]) => {
      createTeamAssignmentsInternal({
        variables: {
          where: {
            resourceId,
          },
          data: {
            teamIds: teamIds,
          },
        },
      })
        .then(() => {
          getResourceTeamAssignmentsRefetch();
        })
        .catch(console.error);
    },
    [createTeamAssignmentsInternal, getResourceTeamAssignmentsRefetch]
  );

  const [
    deleteTeamAssignment,
    { error: deleteTeamAssignmentError, loading: deleteTeamAssignmentLoading },
  ] = useMutation<{
    deleteTeamAssignment: models.TeamAssignment;
  }>(DELETE_TEAM_ASSIGNMENT, {
    update(cache, { data }) {
      if (!data || data === undefined) return;
      const deletedId = data.deleteTeamAssignment.id;

      cache.evict({
        id: cache.identify({
          __typename: "TeamAssignment",
          id: deletedId,
        }),
      });

      cache.gc();
    },
  });

  //Team Assignment Roles

  const [
    addRolesToTeamAssignmentInternal,
    {
      error: addRolesToTeamAssignmentError,
      loading: addRolesToTeamAssignmentLoading,
    },
  ] = useMutation<{
    addRolesToTeamAssignment: models.TeamAssignment;
  }>(ADD_ROLES_TO_TEAM_ASSIGNMENT, {});

  const addRolesToTeamAssignment = useCallback(
    (resourceId: string, teamId: string, roleIds: string[]) => {
      addRolesToTeamAssignmentInternal({
        variables: {
          where: {
            resourceId,
            teamId,
          },
          data: {
            roleIds: roleIds,
          },
        },
      })
        .then(() => {
          getResourceTeamAssignmentsRefetch();
        })
        .catch(console.error);
    },
    [addRolesToTeamAssignmentInternal, getResourceTeamAssignmentsRefetch]
  );

  const [
    removeRolesFromTeamAssignmentInternal,
    {
      error: removeRolesFromTeamAssignmentError,
      loading: removeRolesFromTeamAssignmentLoading,
    },
  ] = useMutation<{
    removeRolesFromTeamAssignment: models.TeamAssignment;
  }>(REMOVE_ROLES_FROM_TEAM_ASSIGNMENT, {});

  const removeRolesFromTeamAssignment = useCallback(
    (resourceId: string, teamId: string, roleIds: string[]) => {
      removeRolesFromTeamAssignmentInternal({
        variables: {
          where: {
            resourceId,
            teamId,
          },
          data: {
            roleIds: roleIds,
          },
        },
      })
        .then(() => {
          getResourceTeamAssignmentsRefetch();
        })
        .catch(console.error);
    },
    [removeRolesFromTeamAssignmentInternal, getResourceTeamAssignmentsRefetch]
  );

  return {
    getResourceTeamAssignmentsData:
      getResourceTeamAssignmentsData?.resource?.teamAssignments || [],
    getResourceTeamAssignmentsError,
    getResourceTeamAssignmentsLoading,
    getResourceTeamAssignmentsRefetch,
    addRolesToTeamAssignment,
    addRolesToTeamAssignmentError,
    addRolesToTeamAssignmentLoading,
    removeRolesFromTeamAssignment,
    removeRolesFromTeamAssignmentError,
    removeRolesFromTeamAssignmentLoading,
    createTeamAssignments,
    createTeamAssignmentsError,
    createTeamAssignmentsLoading,
    deleteTeamAssignment,
    deleteTeamAssignmentError,
    deleteTeamAssignmentLoading,
  };
};

export default useResourceTeamAssignments;
