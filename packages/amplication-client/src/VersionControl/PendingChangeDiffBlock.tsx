import { CircularProgress, CodeCompare } from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import YAML from "yaml";
import * as models from "../models";
import "./PendingChangeDiff.scss";
import { EnumCompareType } from "./PendingChangeDiffEntity";

// This must be here unless we get rid of deepdash as it does not support ES imports
// eslint-disable-next-line @typescript-eslint/no-var-requires
const omitDeep = require("deepdash/omitDeep");

const CLASS_NAME = "pending-change-diff";
const CURRENT_VERSION_NUMBER = 0;

const NON_COMPARABLE_PROPERTIES = [
  "createdAt",
  "updatedAt",
  "versionNumber",
  "__typename",
];
type TData = {
  block: models.Block;
};

type Props = {
  change: models.PendingChange;
  compareType?: EnumCompareType;
};

const PendingChangeDiffBlock = ({
  change,
  compareType = EnumCompareType.Pending,
}: Props) => {
  const { data: dataOtherVersion, loading: loadingOtherVersion } =
    useQuery<TData>(GET_BLOCK_VERSION, {
      variables: {
        id: change.originId,
        whereVersion:
          compareType === EnumCompareType.Pending
            ? {
                not: CURRENT_VERSION_NUMBER,
              }
            : {
                equals:
                  change.versionNumber > 1 ? change.versionNumber - 1 : -1,
              },
      },
      fetchPolicy: "no-cache",
    });

  const { data: dataCurrentVersion, loading: loadingCurrentVersion } =
    useQuery<TData>(GET_BLOCK_VERSION, {
      variables: {
        id: change.originId,
        whereVersion:
          compareType === EnumCompareType.Pending
            ? {
                equals: CURRENT_VERSION_NUMBER,
              }
            : {
                equals: change.versionNumber,
              },
      },
      fetchPolicy: "no-cache",
    });

  const newValue = useMemo(() => {
    return getBlockVersionYAML(dataCurrentVersion);
  }, [dataCurrentVersion]);

  const otherValue = useMemo(() => {
    return getBlockVersionYAML(dataOtherVersion);
  }, [dataOtherVersion]);

  return (
    <div className={CLASS_NAME}>
      {loadingCurrentVersion || loadingOtherVersion ? (
        <CircularProgress centerToParent />
      ) : (
        <CodeCompare oldVersion={otherValue} newVersion={newValue} />
      )}
    </div>
  );
};

function getBlockVersionYAML(data: TData | undefined): string {
  const blockVersions = data?.block?.versions;
  if (!blockVersions || blockVersions.length === 0) return "";

  return YAML.stringify(omitDeep(blockVersions[0], NON_COMPARABLE_PROPERTIES));
}

export default PendingChangeDiffBlock;

export const GET_BLOCK_VERSION = gql`
  query getBlockVersionForCompare($id: String!, $whereVersion: IntFilter) {
    block(where: { id: $id }) {
      id
      parentBlock {
        id
      }
      versions(
        take: 1
        orderBy: { versionNumber: Desc }
        where: { versionNumber: $whereVersion }
      ) {
        versionNumber
        settings
        displayName
        description
      }
    }
  }
`;
