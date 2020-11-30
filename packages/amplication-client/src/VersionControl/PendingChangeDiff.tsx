import React, { useMemo, useState, useCallback } from "react";
import YAML from "yaml";
import { gql, useQuery } from "@apollo/client";
import omitDeep from "deepdash-es/omitDeep";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import * as models from "../models";
import { MultiStateToggle } from "../Components/MultiStateToggle";
import "./PendingChangeDiff.scss";

const CLASS_NAME = "pending-change-diff";
const CURRENT_VERSION_NUMBER = 0;

const SPLIT = "Split";
const UNIFIED = "Unified";

export enum EnumCompareType {
  Pending = "Pending",
  Previous = "Previous",
}

const OPTIONS = [
  { value: UNIFIED, label: UNIFIED },
  { value: SPLIT, label: SPLIT },
];

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
};

const PendingChangeDiff = ({
  change,
  compareType = EnumCompareType.Pending,
}: Props) => {
  const [splitView, setSplitView] = useState<boolean>(false);

  const { data: dataOtherVersion, loading: loadingOtherVersion } = useQuery<
    TData
  >(GET_ENTITY_VERSION, {
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
  >(GET_ENTITY_VERSION, {
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
    return getEntityVersionYAML(dataCurrentVersion);
  }, [dataCurrentVersion]);

  const otherValue = useMemo(() => {
    return getEntityVersionYAML(dataOtherVersion);
  }, [dataOtherVersion]);

  const handleChangeType = useCallback(
    (type: string) => {
      setSplitView(type === SPLIT);
    },
    [setSplitView]
  );

  const diffStyles = {
    variables: {
      light: {
        diffViewerBackground: "#f9f9fa",
        gutterBackground: "#f9f9fa",
      },
    },
  };

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__toolbar`}>
        <MultiStateToggle
          label=""
          name="compareMode"
          options={OPTIONS}
          onChange={handleChangeType}
          selectedValue={splitView ? SPLIT : UNIFIED}
        />
      </div>
      {loadingCurrentVersion || loadingOtherVersion ? (
        "Loading..."
      ) : (
        <ReactDiffViewer
          styles={diffStyles}
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

export default PendingChangeDiff;

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
            appRole {
              displayName
            }
          }
          permissionFields {
            field {
              displayName
            }
            permissionFieldRoles {
              appRole {
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
          searchable
        }
      }
    }
  }
`;
