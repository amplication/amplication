import React, { useMemo } from "react";
import YAML from "yaml";
import { gql, useQuery } from "@apollo/client";
import omitDeep from "deepdash-es/omitDeep";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import * as models from "../models";
import { EnumCompareType, DIFF_STYLES } from "./PendingChangeDiffEntity";
import "./PendingChangeDiff.scss";

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
  splitView: boolean;
};

const PendingChangeDiffBlock = ({
  change,
  compareType = EnumCompareType.Pending,
  splitView,
}: Props) => {
  const { data: dataOtherVersion, loading: loadingOtherVersion } = useQuery<
    TData
  >(GET_BLOCK_VERSION, {
    variables: {
      id: change.resourceId,
      whereVersion:
        compareType === EnumCompareType.Pending
          ? {
              not: CURRENT_VERSION_NUMBER,
            }
          : {
              equals: change.versionNumber > 1 ? change.versionNumber - 1 : -1,
            },
    },
    fetchPolicy: "no-cache",
  });

  const { data: dataCurrentVersion, loading: loadingCurrentVersion } = useQuery<
    TData
  >(GET_BLOCK_VERSION, {
    variables: {
      id: change.resourceId,
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
        "Loading..."
      ) : (
        <ReactDiffViewer
          styles={DIFF_STYLES}
          compareMethod={DiffMethod.WORDS}
          oldValue={otherValue}
          newValue={newValue}
          leftTitle={splitView ? "This Version" : undefined}
          rightTitle="Previous Version"
          splitView={splitView}
        />
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
