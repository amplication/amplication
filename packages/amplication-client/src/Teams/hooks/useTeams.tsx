import { Reference, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import * as models from "../../models";
import {
  ADD_MEMBERS_TO_TEAM,
  CREATE_TEAM,
  DELETE_TEAM,
  FIND_TEAMS,
  GET_TEAM,
  GET_WORKSPACE_USERS,
  REMOVE_MEMBERS_FROM_TEAM,
  TEAM_FIELDS_FRAGMENT,
  UPDATE_TEAM,
} from "../queries/teamsQueries";
import {
  GET_WORKSPACE_MEMBERS,
  TData as MemberListData,
} from "../../Workspaces/MemberList";

export type WorkspaceUsersData = {
  workspaceUsers: Array<models.User>;
};

type TDeleteData = {
  deleteTeam: models.Team;
};

type TFindData = {
  teams: models.Team[];
};

type TGetData = {
  team: models.Team;
};

type TCreateData = {
  createTeam: models.Team;
};

type TUpdateData = {
  updateTeam: models.Team;
};

const NAME_FIELD = "name";

const useTeams = (teamId?: string) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [availableWorkspaceMembers, setAvailableWorkspaceMembers] = useState<
    models.User[]
  >([]);

  const [availableWorkspaceUsers, setAvailableWorkspaceUsers] = useState<
    models.User[]
  >([]);

  const [deleteTeam, { error: deleteTeamError, loading: deleteTeamLoading }] =
    useMutation<TDeleteData>(DELETE_TEAM, {
      update(cache, { data }) {
        if (!data || data === undefined) return;
        const deletedTeamId = data.deleteTeam.id;
        cache.modify({
          fields: {
            teams(existingTeamRefs, { readField }) {
              return existingTeamRefs.filter(
                (teamRef: Reference) =>
                  deletedTeamId !== readField("id", teamRef)
              );
            },
          },
        });
      },
    });

  const [
    createTeam,
    {
      data: createTeamData,
      error: createTeamError,
      loading: createTeamLoading,
    },
  ] = useMutation<TCreateData>(CREATE_TEAM, {
    update(cache, { data }) {
      if (!data) return;

      const newTeam = data.createTeam;

      cache.modify({
        fields: {
          teams(existingTeamRefs = [], { readField }) {
            const newTeamRef = cache.writeFragment({
              data: newTeam,
              fragment: TEAM_FIELDS_FRAGMENT,
            });

            if (
              existingTeamRefs.some(
                (teamRef: Reference) => readField("id", teamRef) === newTeam.id
              )
            ) {
              return existingTeamRefs;
            }

            return [...existingTeamRefs, newTeamRef];
          },
        },
      });
    },
  });

  const {
    data: findTeamsData,
    loading: findTeamsLoading,
    error: findTeamsError,
    refetch: findTeamRefetch,
  } = useQuery<TFindData>(FIND_TEAMS, {
    variables: {
      where: {
        name:
          searchPhrase !== ""
            ? {
                contains: searchPhrase,
                mode: models.QueryMode.Insensitive,
              }
            : undefined,
      },
      orderBy: {
        [NAME_FIELD]: models.SortOrder.Asc,
      },
    },
  });

  const {
    data: getTeamData,
    error: getTeamError,
    loading: getTeamLoading,
    refetch: getTeamRefetch,
  } = useQuery<TGetData>(GET_TEAM, {
    variables: {
      teamId,
    },
    skip: !teamId,
  });

  const [updateTeam, { error: updateTeamError, loading: updateTeamLoading }] =
    useMutation<TUpdateData>(UPDATE_TEAM, {});

  // members/users section

  const [getAvailableWorkspaceMembers, { refetch: refetchAvailableMembers }] =
    useLazyQuery<MemberListData>(GET_WORKSPACE_MEMBERS, {
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        const availableWorkspaceMembers = data.workspaceMembers
          .filter(
            (member) => member.type === models.EnumWorkspaceMemberType.User
          )
          .filter(
            (member) =>
              !getTeamData?.team.members.some(
                (teamMember) =>
                  teamMember.id === (member.member as models.User).id
              )
          );

        setAvailableWorkspaceMembers(
          availableWorkspaceMembers.map(
            (member) => member.member as models.User
          )
        );
      },
    });

  const [getAvailableWorkspaceUsers] = useLazyQuery<WorkspaceUsersData>(
    GET_WORKSPACE_USERS,
    {
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        setAvailableWorkspaceUsers(data.workspaceUsers);
      },
    }
  );

  const [
    addMembersToTeamInternal,
    { error: addMembersToTeamError, loading: addMembersToTeamLoading },
  ] = useMutation<TUpdateData>(ADD_MEMBERS_TO_TEAM, {});

  const addMembersToTeam = useCallback(
    (userIds: string[]) => {
      addMembersToTeamInternal({
        variables: {
          where: {
            id: teamId,
          },
          data: {
            userIds: userIds,
          },
        },
      })
        .then(() => {
          refetchAvailableMembers();
          getTeamRefetch();
        })
        .catch(console.error);
    },
    [addMembersToTeamInternal, teamId, refetchAvailableMembers, getTeamRefetch]
  );

  const [
    removeMembersFromTeamInternal,
    {
      error: removeMembersFromTeamError,
      loading: removeMembersFromTeamLoading,
    },
  ] = useMutation<TUpdateData>(REMOVE_MEMBERS_FROM_TEAM, {});

  const removeMembersFromTeam = useCallback(
    (userIds: string[]) => {
      removeMembersFromTeamInternal({
        variables: {
          where: {
            id: teamId,
          },
          data: {
            userIds: userIds,
          },
        },
      })
        .then(() => {
          refetchAvailableMembers();
          getTeamRefetch();
        })
        .catch(console.error);
    },
    [
      removeMembersFromTeamInternal,
      teamId,
      refetchAvailableMembers,
      getTeamRefetch,
    ]
  );

  return {
    getAvailableWorkspaceMembers,
    availableWorkspaceMembers,
    getAvailableWorkspaceUsers,
    availableWorkspaceUsers,
    deleteTeam,
    deleteTeamError,
    deleteTeamLoading,
    createTeam,
    createTeamData,
    createTeamError,
    createTeamLoading,
    findTeamsData,
    findTeamsLoading,
    findTeamsError,
    findTeamRefetch,
    getTeamData,
    getTeamError,
    getTeamLoading,
    getTeamRefetch,
    updateTeam,
    updateTeamError,
    updateTeamLoading,
    setSearchPhrase,
    addMembersToTeam,
    addMembersToTeamError,
    addMembersToTeamLoading,
    removeMembersFromTeam,
    removeMembersFromTeamError,
    removeMembersFromTeamLoading,
  };
};

export default useTeams;
