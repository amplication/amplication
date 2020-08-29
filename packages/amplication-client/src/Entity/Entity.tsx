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
import { Panel, EnumPanelStyle } from "../Components/Panel";

import "./Entity.scss";
import { isEmpty } from "lodash";

type Props = {
  match: match<{ application: string; entityId: string; fieldId: string }>;
};

type TData = {
  entity: models.Entity;
};

const Entity = ({ match }: Props) => {
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

  const { data, loading, error } = useQuery<TData>(GET_ENTITY, {
    variables: {
      id: entityId,
    },
  });

  const [updateEntity, { error: updateError }] = useMutation(UPDATE_ENTITY);

  const handleSubmit = useCallback(
    (data: Omit<models.Entity, "versionNumber">) => {
      /**@todo: check why the "fields" and "permissions" properties are not removed by omitDeep in the form */
      let {
        id,
        fields,
        permissions,
        lockedByUser,
        ...sanitizedCreateData
      } = data;

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

  const errorMessage = formatError(error || updateError);
  return (
    <PageContent className="entity" withFloatingBar>
      <main>
        {loading ? (
          <span>Loading...</span>
        ) : !data ? (
          <span>can't find</span> /**@todo: Show formatted error message */
        ) : (
          <>
            <FloatingToolbar
              lockData={{
                lockedAt: data.entity.lockedAt,
                lockedByUser: data.entity.lockedByUser,
                resourceId: data.entity.id,
                resourceType: models.EnumPendingChangeResourceType.Entity,
              }}
            />
            <EntityForm
              entity={data.entity}
              applicationId={application}
              onSubmit={handleSubmit}
            />
            <Panel
              className="entity-field-list"
              panelStyle={EnumPanelStyle.Transparent}
            >
              <EntityFieldList entityId={data.entity.id} />
            </Panel>
          </>
        )}
      </main>
      {data && (
        <Sidebar
          modal
          open={!isEmpty(fieldId) || isPermissionsOpen}
          largeMode={isPermissionsOpen}
        >
          {!isEmpty(fieldId) && <EntityField />}
          {isPermissionsOpen && (
            <PermissionsForm
              entityId={entityId}
              applicationId={application}
              availableActions={ENTITY_ACTIONS}
              backUrl={`/${application}/entities/${data.entity.id}`}
              objectDisplayName={data.entity.pluralDisplayName}
            />
          )}
        </Sidebar>
      )}
      <Snackbar open={Boolean(error || updateError)} message={errorMessage} />
    </PageContent>
  );
};

export default Entity;

export const GET_ENTITY = gql`
  query getEntity($id: String!) {
    entity(where: { id: $id }) {
      id
      name
      displayName
      pluralDisplayName
      description
      lockedAt
      lockedByUser {
        account {
          firstName
          lastName
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
      lockedAt
      lockedByUser {
        account {
          firstName
          lastName
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
