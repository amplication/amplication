import { Reference, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import * as models from "../../models";
import {
  CREATE_TEAM,
  DELETE_TEAM,
  FIND_TEAMS,
  GET_TEAM,
  TEAM_FIELDS_FRAGMENT,
  UPDATE_TEAM,
} from "../queries/teamsQueries";
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

const useTeam = (teamId?: string) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");

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
        displayName:
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

  return {
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
  };
};

export default useTeam;
