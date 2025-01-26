import { Reference, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import * as models from "../../models";
import {
  BLUEPRINT_FIELDS_FRAGMENT,
  CREATE_BLUEPRINT,
  DELETE_BLUEPRINT,
  DELETE_BLUEPRINT_RELATION,
  FIND_BLUEPRINTS,
  GET_BLUEPRINT,
  GET_BLUEPRINTS_MAP,
  UPDATE_BLUEPRINT,
  UPDATE_BLUEPRINT_ENGINE,
  UPSERT_BLUEPRINT_RELATION,
} from "../queries/blueprintsQueries";

type TDeleteData = {
  deleteBlueprint: models.Blueprint;
};

type TFindData = {
  blueprints: models.Blueprint[];
};

type TGetData = {
  blueprint: models.Blueprint;
};

type TCreateData = {
  createBlueprint: models.Blueprint;
};
type TUpdateData = {
  updateBlueprint: models.Blueprint;
};

type TUpsertRelationData = {
  upsertBlueprintRelation: models.BlueprintRelation;
};

type TDeleteRelationData = {
  deleteBlueprintRelation: models.BlueprintRelation;
};

const NAME_FIELD = "name";

const useBlueprints = (blueprintId?: string) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [
    deleteBlueprint,
    { error: deleteBlueprintError, loading: deleteBlueprintLoading },
  ] = useMutation<TDeleteData>(DELETE_BLUEPRINT, {
    refetchQueries: [GET_BLUEPRINTS_MAP],
    update(cache, { data }) {
      if (!data || data === undefined) return;
      const deletedBlueprintId = data.deleteBlueprint.id;
      cache.modify({
        fields: {
          blueprints(existingBlueprintRefs, { readField }) {
            return existingBlueprintRefs.filter(
              (blueprintRef: Reference) =>
                deletedBlueprintId !== readField("id", blueprintRef)
            );
          },
        },
      });
    },
  });

  const [
    createBlueprint,
    {
      data: createBlueprintData,
      error: createBlueprintError,
      loading: createBlueprintLoading,
    },
  ] = useMutation<TCreateData>(CREATE_BLUEPRINT, {
    refetchQueries: [GET_BLUEPRINTS_MAP],
    update(cache, { data }) {
      if (!data) return;

      const newBlueprint = data.createBlueprint;

      cache.modify({
        fields: {
          blueprints(existingBlueprintRefs = [], { readField }) {
            const newBlueprintRef = cache.writeFragment({
              data: newBlueprint,
              fragment: BLUEPRINT_FIELDS_FRAGMENT,
              fragmentName: "BlueprintFields",
            });

            if (
              existingBlueprintRefs.some(
                (blueprintRef: Reference) =>
                  readField("id", blueprintRef) === newBlueprint.id
              )
            ) {
              return existingBlueprintRefs;
            }

            return [...existingBlueprintRefs, newBlueprintRef];
          },
        },
      });
    },
  });

  const {
    data: findBlueprintsData,
    loading: findBlueprintsLoading,
    error: findBlueprintsError,
    refetch: findBlueprintRefetch,
  } = useQuery<TFindData>(FIND_BLUEPRINTS, {
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
    data: getBlueprintData,
    error: getBlueprintError,
    loading: getBlueprintLoading,
    refetch: getBlueprintRefetch,
  } = useQuery<TGetData>(GET_BLUEPRINT, {
    variables: {
      blueprintId,
    },
    skip: !blueprintId,
  });

  const [
    updateBlueprint,
    { error: updateBlueprintError, loading: updateBlueprintLoading },
  ] = useMutation<TUpdateData>(UPDATE_BLUEPRINT, {
    refetchQueries: [GET_BLUEPRINTS_MAP],
  });

  const [
    updateBlueprintEngine,
    {
      error: updateBlueprintEngineError,
      loading: updateBlueprintEngineLoading,
    },
  ] = useMutation<TUpdateData>(UPDATE_BLUEPRINT_ENGINE, {
    refetchQueries: [GET_BLUEPRINTS_MAP],
  });

  const [
    deleteBlueprintRelation,
    {
      error: deleteBlueprintRelationError,
      loading: deleteBlueprintRelationLoading,
    },
  ] = useMutation<TDeleteRelationData>(DELETE_BLUEPRINT_RELATION, {
    refetchQueries: [GET_BLUEPRINTS_MAP],
  });

  const [
    upsertBlueprintRelation,
    {
      error: upsertBlueprintRelationError,
      loading: upsertBlueprintRelationLoading,
    },
  ] = useMutation<TUpsertRelationData>(UPSERT_BLUEPRINT_RELATION, {
    refetchQueries: [GET_BLUEPRINTS_MAP],
  });

  return {
    deleteBlueprint,
    deleteBlueprintError,
    deleteBlueprintLoading,
    createBlueprint,
    createBlueprintData,
    createBlueprintError,
    createBlueprintLoading,
    findBlueprintsData,
    findBlueprintsLoading,
    findBlueprintsError,
    findBlueprintRefetch,
    getBlueprintData,
    getBlueprintError,
    getBlueprintLoading,
    getBlueprintRefetch,
    updateBlueprint,
    updateBlueprintError,
    updateBlueprintLoading,
    setSearchPhrase,
    upsertBlueprintRelation,
    upsertBlueprintRelationError,
    upsertBlueprintRelationLoading,
    deleteBlueprintRelation,
    deleteBlueprintRelationError,
    deleteBlueprintRelationLoading,
    updateBlueprintEngine,
    updateBlueprintEngineError,
    updateBlueprintEngineLoading,
  };
};

export default useBlueprints;
