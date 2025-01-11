import { Reference, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import * as models from "../../models";
import {
  ADD_MEMBER_TO_TEAMS,
  ADD_MEMBERS_TO_TEAM,
  ADD_ROLES_TO_TEAM,
  CREATE_TEAM,
  DELETE_TEAM,
  FIND_TEAMS,
  GET_TEAM,
  GET_WORKSPACE_USERS,
  REMOVE_MEMBERS_FROM_TEAM,
  REMOVE_ROLES_FROM_TEAM,
  TEAM_FIELDS_FRAGMENT,
  UPDATE_TEAM,
} from "../queries/teamsQueries";
import {
  GET_WORKSPACE_MEMBERS,
  TData as MemberListData,
} from "../../Workspaces/MemberList";
import { USER_FIELDS_FRAGMENT } from "../../User/queries/userQueries";

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
              fragmentName: "TeamFields",
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

  //Team members

  const [
    addMembersToTeamInternal,
    { error: addMembersToTeamError, loading: addMembersToTeamLoading },
  ] = useMutation<{
    addMembersToTeam: models.Team;
  }>(ADD_MEMBERS_TO_TEAM, {
    update(cache, { data }) {
      if (!data) return;

      const updatedTeam = data.addMembersToTeam;

      // Iterate over each member in the updated team
      updatedTeam.members.forEach((member) => {
        // Identify the user's cache entry
        const userId = cache.identify({ __typename: "User", id: member.id });

        if (!userId) return; // If the user is not in the cache, skip

        // Modify the user's teams field
        cache.modify({
          id: userId,
          fields: {
            teams(existingTeamsRefs = [], { readField }) {
              // Check if the team is already in the user's teams to avoid duplicates
              const isAlreadyInTeams = existingTeamsRefs.some(
                (teamRef: any) => readField("id", teamRef) === updatedTeam.id
              );

              if (isAlreadyInTeams) {
                return existingTeamsRefs;
              }

              // Create a reference to the updated team
              const newTeamRef = cache.writeFragment({
                data: updatedTeam,
                fragment: TEAM_FIELDS_FRAGMENT,
                fragmentName: "TeamFields",
              });

              return [...existingTeamsRefs, newTeamRef];
            },
          },
        });
      });
    },
  });

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
    addMemberToTeamsInternal,
    { error: addMemberToTeamsError, loading: addMemberToTeamsLoading },
  ] = useMutation<{
    addMemberToTeams: models.User;
  }>(ADD_MEMBER_TO_TEAMS, {
    update(cache, { data }) {
      if (!data) return;

      const updatedUser = data.addMemberToTeams;

      // Iterate over each member in the updated team
      updatedUser.teams.forEach((team) => {
        // Identify the user's cache entry
        const teamId = cache.identify({ __typename: "Team", id: team.id });

        if (!teamId) return; // If the user is not in the cache, skip

        // Modify the user's teams field
        cache.modify({
          id: teamId,
          fields: {
            members(existingMembersRefs = [], { readField }) {
              // Check if the team is already in the user's teams to avoid duplicates
              const isAlreadyInTeams = existingMembersRefs.some(
                (memberRef: any) =>
                  readField("id", memberRef) === updatedUser.id
              );

              if (isAlreadyInTeams) {
                return existingMembersRefs;
              }

              // Create a reference to the updated team
              const newMemberRef = cache.writeFragment({
                data: updatedUser,
                fragment: USER_FIELDS_FRAGMENT,
                fragmentName: "UserFields",
              });

              return [...existingMembersRefs, newMemberRef];
            },
          },
        });
      });
    },
  });

  const addMemberToTeams = useCallback(
    (userId: string, teamIds: string[]) => {
      addMemberToTeamsInternal({
        variables: {
          where: {
            id: userId,
          },
          data: {
            teamIds: teamIds,
          },
        },
      }).catch(console.error);
    },
    [addMemberToTeamsInternal]
  );

  const [
    removeMembersFromTeamInternal,
    {
      error: removeMembersFromTeamError,
      loading: removeMembersFromTeamLoading,
    },
  ] = useMutation<{
    removeMembersFromTeam: models.Team;
  }>(REMOVE_MEMBERS_FROM_TEAM, {});

  const removeMembersFromTeam = useCallback(
    (teamId: string, userIds: string[]) => {
      removeMembersFromTeamInternal({
        variables: {
          where: {
            id: teamId,
          },
          data: {
            userIds: userIds,
          },
        },
        update(cache, { data }) {
          if (!data) return;

          const updatedTeam = data.removeMembersFromTeam;

          // Iterate over each removed member ID
          userIds.forEach((memberId) => {
            // Identify the user's cache entry
            const userId = cache.identify({ __typename: "User", id: memberId });

            if (!userId) return; // If the user is not in the cache, skip

            // Modify the user's teams field to remove the team
            cache.modify({
              id: userId,
              fields: {
                teams(existingTeamsRefs: any[] = [], { readField }) {
                  return existingTeamsRefs.filter(
                    (teamRef) => readField("id", teamRef) !== updatedTeam.id
                  );
                },
              },
            });
          });
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

  //Team Roles

  const [
    addRolesToTeamInternal,
    { error: addRolesToTeamError, loading: addRolesToTeamLoading },
  ] = useMutation<TUpdateData>(ADD_ROLES_TO_TEAM, {});

  const addRolesToTeam = useCallback(
    (roleIds: string[]) => {
      addRolesToTeamInternal({
        variables: {
          where: {
            id: teamId,
          },
          data: {
            roleIds: roleIds,
          },
        },
      })
        .then(() => {
          getTeamRefetch();
        })
        .catch(console.error);
    },
    [addRolesToTeamInternal, teamId, getTeamRefetch]
  );

  const [
    removeRolesFromTeamInternal,
    { error: removeRolesFromTeamError, loading: removeRolesFromTeamLoading },
  ] = useMutation<TUpdateData>(REMOVE_ROLES_FROM_TEAM, {});

  const removeRolesFromTeam = useCallback(
    (roleIds: string[]) => {
      removeRolesFromTeamInternal({
        variables: {
          where: {
            id: teamId,
          },
          data: {
            roleIds: roleIds,
          },
        },
      })
        .then(() => {
          getTeamRefetch();
        })
        .catch(console.error);
    },
    [removeRolesFromTeamInternal, teamId, getTeamRefetch]
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
    addRolesToTeam,
    addRolesToTeamError,
    addRolesToTeamLoading,
    removeRolesFromTeam,
    removeRolesFromTeamError,
    removeRolesFromTeamLoading,
    addMemberToTeams,
    addMemberToTeamsError,
    addMemberToTeamsLoading,
  };
};

export default useTeams;
