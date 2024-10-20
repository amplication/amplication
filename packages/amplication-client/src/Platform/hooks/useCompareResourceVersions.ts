import { useQuery } from "@apollo/client";
import * as models from "../../models";
import { COMPARE_RESOURCE_VERSIONS } from "./resourceVersionQueries";

type TCompareResourceVersions = {
  compareResourceVersions: models.ResourceVersionsDiff;
};

const useCompareResourceVersions = (
  resourceId: string,
  sourceVersion: string,
  targetVersion: string
) => {
  const { data, loading, error, refetch } = useQuery<TCompareResourceVersions>(
    COMPARE_RESOURCE_VERSIONS,
    {
      variables: {
        where: {
          resource: { id: resourceId },
          sourceVersion: sourceVersion,
          targetVersion: targetVersion,
        },
      },
      skip: !resourceId || !targetVersion,
    }
  );

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useCompareResourceVersions;
