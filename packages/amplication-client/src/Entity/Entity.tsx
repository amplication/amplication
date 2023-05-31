import React, { useCallback, useContext } from "react";
import { Switch, match } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { CircularProgress, Snackbar } from "@amplication/ui/design-system";
import * as models from "../models";
import { formatError } from "../util/error";
import PageContent from "../Layout/PageContent";
import EntityForm from "./EntityForm";
import { EntityFieldLinkList } from "./EntityFieldLinkList";
import EntityFieldList from "./EntityFieldList";
import EntityField from "../Entity/EntityField";
import PermissionsForm from "../Permissions/PermissionsForm";
import { ENTITY_ACTIONS } from "./constants";
import { track } from "../util/analytics";
import InnerTabLink from "../Layout/InnerTabLink";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";

import "./Entity.scss";
import { AppContext } from "../context/appContext";

type Props = {
  match: match<{ resource: string; entityId: string; fieldId: string }>;
};

type TData = {
  entity: models.Entity;
};

type UpdateData = {
  updateEntity: models.Entity;
};

const Entity = ({ match }: Props) => {
  const { entityId, resource } = match.params;
  const { addEntity, currentWorkspace, currentProject } =
    useContext(AppContext);

  const { data, loading, error } = useQuery<TData>(GET_ENTITY, {
    variables: {
      id: entityId,
    },
  });

  const [updateEntity, { error: updateError }] = useMutation<UpdateData>(
    UPDATE_ENTITY,
    {
      onCompleted: (data) => {
        addEntity(data.updateEntity.id);
      },
    }
  );

  const handleSubmit = useCallback(
    (data: Omit<models.Entity, "versionNumber">) => {
      /**@todo: check why the "fields" and "permissions" properties are not removed by omitDeep in the form */

      const {
        id,
        fields, // eslint-disable-line @typescript-eslint/no-unused-vars
        permissions, // eslint-disable-line @typescript-eslint/no-unused-vars
        lockedByUser, // eslint-disable-line @typescript-eslint/no-unused-vars
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
    <PageContent
      pageTitle={data?.entity.displayName}
      className="entity"
      sideContent={
        data && (
          <>
            <h2>{data?.entity.displayName}</h2>
            <InnerTabLink
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/entities/${data.entity.id}`}
              icon="settings"
            >
              General Settings
            </InnerTabLink>
            <InnerTabLink
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/entities/${data.entity.id}/permissions`}
              icon="lock"
            >
              Permissions
            </InnerTabLink>
            <InnerTabLink
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resource}/entities/${data.entity.id}/fields`}
              icon="option_set"
            >
              Fields
            </InnerTabLink>
            <div className="sub-list">
              <EntityFieldLinkList entityId={data.entity.id} />
            </div>
          </>
        )
      }
    >
      {loading ? (
        <CircularProgress centerToParent />
      ) : !data ? (
        <span>can't find</span> /**@todo: Show formatted error message */
      ) : (
        <Switch>
          <RouteWithAnalytics path="/:workspace/:project/:resource/entities/:entityId/permissions">
            <PermissionsForm
              entityId={entityId}
              resourceId={resource}
              availableActions={ENTITY_ACTIONS}
              objectDisplayName={data.entity.pluralDisplayName}
            />
          </RouteWithAnalytics>
          <RouteWithAnalytics path="/:workspace/:project/:resource/entities/:entityId/fields/:fieldId">
            <EntityField />
          </RouteWithAnalytics>
          <RouteWithAnalytics path="/:workspace/:project/:resource/entities/:entityId/fields/">
            <EntityFieldList entityId={data.entity.id} />
          </RouteWithAnalytics>
          <RouteWithAnalytics path="/:workspace/:project/:resource/entities/:entityId">
            <EntityForm
              entity={data.entity}
              resourceId={resource}
              onSubmit={handleSubmit}
            />
          </RouteWithAnalytics>
        </Switch>
      )}

      <Snackbar open={Boolean(error || updateError)} message={errorMessage} />
    </PageContent>
  );
};

const enhance = track((props) => {
  return { entityId: props.match.params.entityId };
});

export default enhance(Entity);

export const GET_ENTITY = gql`
  query getEntity($id: String!) {
    entity(where: { id: $id }) {
      id
      name
      displayName
      pluralDisplayName
      customAttributes
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
        unique
        required
        searchable
        customAttributes
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
      customAttributes
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
        unique
        searchable
        customAttributes
        dataType
        description
      }
    }
  }
`;
