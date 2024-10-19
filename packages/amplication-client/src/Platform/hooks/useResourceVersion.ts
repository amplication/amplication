import { useQuery } from "@apollo/client";
import * as models from "../../models";
import { GET_RESOURCE_VERSION } from "./resourceVersionQueries";

type TGetResourceVersion = {
  resourceVersion: models.ResourceVersion;
};

const useResourceVersion = (resourceVersionId: string | undefined) => {
  const { data, loading, error, refetch } = useQuery<TGetResourceVersion>(
    GET_RESOURCE_VERSION,
    {
      variables: {
        id: resourceVersionId,
      },
      skip: !resourceVersionId,
    }
  );

  return {
    data: data?.resourceVersion,
    loading,
    error,
    refetch,
  };
};

export default useResourceVersion;
