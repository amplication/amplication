import { useQuery } from "@apollo/client";
import { groupBy } from "lodash";
import { useState } from "react";
import { Commit, PendingChange } from "../../models";
import { GET_COMMIT } from "./commitQueries";

export type ChangesByResource = {
  resourceId: string;
  changes: PendingChange[];
}[];

const useCommitChanges = (commitId: string) => {
  const [commitChangesByResource, setCommitChangesByResource] =
    useState<ChangesByResource>([]);

  useQuery<{ commit: Commit }>(GET_COMMIT, {
    skip: !commitId,
    variables: {
      commitId: commitId,
    },
    onCompleted: (data) => {
      const changesByResource = groupBy(
        data.commit?.changes,
        (originChange) => {
          if (!originChange.resource) return;
          return originChange.resource.id;
        }
      );
      const changesByResourceList = Object.entries(changesByResource).map(
        ([resourceId, changes]) => {
          return {
            resourceId,
            changes,
          };
        }
      );
      setCommitChangesByResource(changesByResourceList);
    },
  });

  return {
    commitChangesByResource,
  };
};

export default useCommitChanges;
