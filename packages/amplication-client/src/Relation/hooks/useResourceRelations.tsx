import { useMutation, useQuery } from "@apollo/client";
import * as models from "../../models";
import {
  GET_RESOURCE_RELATIONS,
  UPDATE_RESOURCE_RELATION,
} from "../queries/resourceRelationsQueries";
import { useAppContext } from "../../context/appContext";

type TUpdateData = {
  updateResourceRelation: models.Relation;
};

const useResourceRelations = (resourceId?: string) => {
  const { addEntity } = useAppContext();

  const { data, loading, error, refetch } = useQuery<{
    relations: models.Relation[];
  }>(GET_RESOURCE_RELATIONS, {
    variables: {
      resourceId: resourceId,
    },
  });

  const [
    updateRelation,
    { error: updateRelationError, loading: updateRelationLoading },
  ] = useMutation<TUpdateData>(UPDATE_RESOURCE_RELATION, {
    onCompleted: (data) => {
      addEntity(data.updateResourceRelation.id);
    },
  });

  return {
    relations: data?.relations || [],
    loading,
    error,
    refetch,
    updateRelation,
    updateRelationError,
    updateRelationLoading,
  };
};

export default useResourceRelations;
