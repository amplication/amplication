import React, { useCallback } from "react";
import { match, useRouteMatch } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";

import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";

import * as models from "../models";
import { formatError } from "../util/error";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import EntityForm from "./EntityForm";
import { EntityFieldList } from "./EntityFieldList";
import Sidebar from "../Layout/Sidebar";
import EntityField from "../Entity/EntityField";
import PermissionsForm from "../Permissions/PermissionsForm";
import { ENTITY_ACTIONS } from "./constants";

import "./Entity.scss";
import { isEmpty } from "lodash";

type Props = {
  match: match<{ application: string; entityId: string; fieldId: string }>;
};

type TData = {
  entity: models.Entity;
};

function Entity({ match }: Props) {
  const { entityId, application } = match.params;

  const fieldMatch = useRouteMatch<{ fieldId: string }>(
    "/:application/entities/:entityId/fields/:fieldId"
  );

  let fieldId = null;
  if (fieldMatch) {
    fieldId = fieldMatch.params.fieldId;
  }

  const permissionsMatch = useRouteMatch(
    "/:application/entities/:entityId/permissions"
  );

  let isPermissionsOpen = false;
  if (permissionsMatch) {
    isPermissionsOpen = true;
  }

  const { data, loading, error, refetch } = useQuery<TData>(GET_ENTITY, {
    variables: {
      id: entityId,
    },
  });

  const [updateEntity, { error: updateError }] = useMutation(UPDATE_ENTITY);

  const [
    updateEntityPermissions,
    { error: updatePermissionsError },
  ] = useMutation(UPDATE_ENTITY_PERMISSIONS);

  const handleSubmit = useCallback(
    (data: Omit<models.Entity, "versionNumber">) => {
      /**@todo: check why the "fields" property is not removed by omitDeep in the form */
      let { id, fields, ...sanitizedCreateData } = data;

      updateEntity({
        variables: {
          data: {
            ...sanitizedCreateData,
          },
          where: {
            id: id,
          },
        },
      }).catch(console.error);
    },
    [updateEntity]
  );

  const handleEntityPermissionsSubmit = useCallback(
    (update: models.EntityUpdatePermissionsInput) => {
      updateEntityPermissions({
        variables: {
          data: update,
          where: {
            id: entityId,
          },
        },
        /**@todo: use optimisticResponse to trigger the cache update immediately  */
        // optimisticResponse: {
        //   data: {
        //     updateEntityPermissions: [
        //     ],
        //   },
        // },
        update: (proxy, { data: { updateEntityPermissions } }) => {
          const cacheData = proxy.readQuery<TData>({
            query: GET_ENTITY,
            variables: {
              id: entityId,
            },
          });
          if (cacheData === null) {
            return;
          }
          proxy.writeQuery<TData>({
            query: GET_ENTITY,
            data: {
              entity: {
                ...cacheData.entity,
                permissions: updateEntityPermissions,
              },
            },
          });
        },
      }).catch(() => {
        /**@todo: give the user a feedback about the conflict */
        refetch();
      });
    },
    [updateEntityPermissions, entityId, refetch]
  );

  const errorMessage = formatError(
    error || updateError || updatePermissionsError
  );
  return (
    <PageContent className="entity" withFloatingBar>
      <main>
        {loading ? (
          <span>Loading...</span>
        ) : !data ? (
          <span>can't find</span> /**@todo: Show formatted error message */
        ) : (
          <>
            <FloatingToolbar />
            <EntityForm
              entity={data.entity}
              applicationId={application}
              onSubmit={handleSubmit}
            />
            <div className="entity-field-list">
              <EntityFieldList entityId={data.entity.id} />
            </div>
          </>
        )}
      </main>
      {data && (
        <Sidebar modal open={!isEmpty(fieldId) || isPermissionsOpen}>
          {!isEmpty(fieldId) && <EntityField />}
          {isPermissionsOpen && (
            <PermissionsForm
              applicationId={application}
              availableActions={ENTITY_ACTIONS}
              backUrl={`/${application}/entities/${data.entity.id}`}
              objectDisplayName={data.entity.pluralDisplayName}
              onSubmit={handleEntityPermissionsSubmit}
              permissions={data.entity.permissions || []}
            />
          )}
        </Sidebar>
      )}
      <Snackbar
        open={Boolean(error || updateError || updatePermissionsError)}
        message={errorMessage}
      />
    </PageContent>
  );
}

export default Entity;

export const GET_ENTITY = gql`
  query getEntity($id: String!) {
    entity(where: { id: $id }) {
      id
      name
      displayName
      pluralDisplayName
      description
      lockedByUserId
      lockedAt
      permissions {
        action
        appRoleId
        appRole {
          displayName
        }
      }
      fields {
        id
        name
        displayName
        required
        searchable
        dataType
        description
      }
    }
  }
`;

const UPDATE_ENTITY = gql`
  mutation updateEntity($data: EntityUpdateInput!, $where: WhereUniqueInput!) {
    updateEntity(data: $data, where: $where) {
      id
      name
      displayName
      pluralDisplayName
      description
      lockedByUserId
      lockedAt
      permissions {
        action
        appRoleId
        appRole {
          displayName
        }
      }
      fields {
        id
        name
        displayName
        required
        searchable
        dataType
        description
      }
    }
  }
`;

const UPDATE_ENTITY_PERMISSIONS = gql`
  mutation updateEntityPermissions(
    $data: EntityUpdatePermissionsInput!
    $where: WhereUniqueInput!
  ) {
    updateEntityPermissions(data: $data, where: $where) {
      action
      appRoleId
      appRole {
        displayName
      }
    }
  }
`;
