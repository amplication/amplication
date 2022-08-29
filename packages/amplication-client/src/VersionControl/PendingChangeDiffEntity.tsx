import React, { useMemo } from "react";
import YAML from "yaml";
import { gql, useQuery } from "@apollo/client";
import omitDeep from "deepdash-es/omitDeep";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import * as models from "../models";
import "./PendingChangeDiff.scss";

export enum EnumCompareType {
  Pending = "Pending",
  Previous = "Previous",
}

const CLASS_NAME = "pending-change-diff";
const CURRENT_VERSION_NUMBER = 0;

const NON_COMPARABLE_PROPERTIES = [
  "createdAt",
  "updatedAt",
  "versionNumber",
  "__typename",
];
type TData = {
  entity: models.Entity;
};

type Props = {
  change: models.PendingChange;
  compareType?: EnumCompareType;
  splitView: boolean;
};

export const DIFF_STYLES = {
  variables: {
    light: {
      diffViewerBackground: "var(--diffViewerBackground)",
      diffViewerColor: "var(--diffViewerColor)",
      addedBackground: "var(--addedBackground)",
      addedColor: "var(--addedColor)",
      removedBackground: "var(--removedBackground)",
      removedColor: "var(--removedColor)",
      wordAddedBackground: "var(--wordAddedBackground)",
      wordRemovedBackground: "var(--wordRemovedBackground)",
      addedGutterBackground: "var(--addedGutterBackground)",
      removedGutterBackground: "var(--removedGutterBackground)",
      gutterBackground: "var(--gutterBackground)",
      gutterBackgroundDark: "var(--gutterBackgroundDark)",
      highlightBackground: "var(--highlightBackground)",
      highlightGutterBackground: "var(--highlightGutterBackground)",
      codeFoldGutterBackground: "var(--codeFoldGutterBackground)",
      codeFoldBackground: "var(--codeFoldBackground)",
      emptyLineBackground: "var(--emptyLineBackground)",
      gutterColor: "var(--gutterColor)",
      addedGutterColor: "var(--addedGutterColor)",
      removedGutterColor: "var(--removedGutterColor)",
      codeFoldContentColor: "var(--codeFoldContentColor)",
      diffViewerTitleBackground: "var(--diffViewerTitleBackground)",
      diffViewerTitleColor: "var(--diffViewerTitleColor)",
      diffViewerTitleBorderColor: "var(--diffViewerTitleBorderColor)",
    },
  },
};

const PendingChangeDiffEntity = ({
  change,
  compareType = EnumCompareType.Pending,
  splitView,
}: Props) => {
  const { data: dataOtherVersion, loading: loadingOtherVersion } = useQuery<
    TData
  >(GET_ENTITY_VERSION, {
    variables: {
      id: change.originId,
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
  >(GET_ENTITY_VERSION, {
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
    return getEntityVersionYAML(dataCurrentVersion);
  }, [dataCurrentVersion]);

  const otherValue = useMemo(() => {
    return getEntityVersionYAML(dataOtherVersion);
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

function getEntityVersionYAML(data: TData | undefined): string {
  const entityVersions = data?.entity?.versions;
  if (!entityVersions || entityVersions.length === 0) return "";

  return YAML.stringify(omitDeep(entityVersions[0], NON_COMPARABLE_PROPERTIES));
}

export default PendingChangeDiffEntity;

export const GET_ENTITY_VERSION = gql`
  query getEntityVersionForCompare($id: String!, $whereVersion: IntFilter) {
    entity(where: { id: $id }) {
      id
      versions(
        take: 1
        orderBy: { versionNumber: Desc }
        where: { versionNumber: $whereVersion }
      ) {
        versionNumber
        name
        displayName
        pluralDisplayName
        description
        permissions {
          action
          type
          permissionRoles {
            resourceRole {
              displayName
            }
          }
          permissionFields {
            field {
              displayName
            }
            permissionRoles {
              resourceRole {
                displayName
              }
            }
          }
        }
        fields(orderBy: { permanentId: Asc }) {
          permanentId
          name
          description
          displayName
          dataType
          properties
          required
          unique
          searchable
        }
      }
    }
  }
`;
