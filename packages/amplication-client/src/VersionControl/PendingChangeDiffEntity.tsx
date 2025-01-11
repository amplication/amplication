import { CircularProgress, CodeCompare } from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";
import YAML from "yaml";
import * as models from "../models";
import "./PendingChangeDiff.scss";

// This must be here unless we get rid of deepdash as it does not support ES imports
// eslint-disable-next-line @typescript-eslint/no-var-requires
const omitDeep = require("deepdash/omitDeep");

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
};

const PendingChangeDiffEntity = ({
  change,
  compareType = EnumCompareType.Pending,
}: Props) => {
  const { data: dataOtherVersion, loading: loadingOtherVersion } =
    useQuery<TData>(GET_ENTITY_VERSION, {
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
    useQuery<TData>(GET_ENTITY_VERSION, {
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
        <CircularProgress centerToParent />
      ) : (
        <CodeCompare oldVersion={otherValue} newVersion={newValue} />
      )}
    </div>
  );
};

function getEntityVersionYAML(data: TData | undefined): string {
  const entityVersions = data?.entity?.versions;
  if (!entityVersions || entityVersions.length === 0) return "";

  const versionWithSortedField = {
    ...entityVersions[0],
    fields: entityVersions[0].fields.sort((a, b) =>
      a.name.localeCompare(b.name)
    ),
  };

  return YAML.stringify(
    omitDeep(versionWithSortedField, NON_COMPARABLE_PROPERTIES)
  );
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
        customAttributes
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
          customAttributes
        }
      }
    }
  }
`;
