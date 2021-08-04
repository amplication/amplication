import React, { useCallback, useContext } from "react";
import { Switch, match, useLocation } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import PendingChangesContext from "../VersionControl/PendingChangesContext";
import * as models from "../models";
import { formatError } from "../util/error";
import PageContent from "../Layout/PageContent";
import EntityForm from "./EntityForm";
import { EntityFieldLinkList } from "./EntityFieldLinkList";
import { EntityFieldList } from "./EntityFieldList";
import EntityField from "../Entity/EntityField";
import PermissionsForm from "../Permissions/PermissionsForm";
import { ENTITY_ACTIONS } from "./constants";
import useNavigationTabs from "../Layout/UseNavigationTabs";
import { useTracking, track } from "../util/analytics";
import InnerTabLink from "../Layout/InnerTabLink";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";

import "./Entity.scss";

type Props = {
  match: match<{ application: string; entityId: string; fieldId: string }>;
};

type TData = {
  entity: models.Entity;
};

type UpdateData = {
  updateEntity: models.Entity;
};
const NAVIGATION_KEY = "ENTITY";

const Entity = ({ match }: Props) => {
  const { entityId, application } = match.params;
  const { trackEvent } = useTracking();
  const pendingChangesContext = useContext(PendingChangesContext);
  const location = useLocation();

  const { data, loading, error } = useQuery<TData>(GET_ENTITY, {
    variables: {
      id: entityId,
    },
  });

  useNavigationTabs(
    application,
    `${NAVIGATION_KEY}_${entityId}`,
    location.pathname,
    data?.entity.displayName
  );

  const [updateEntity, { error: updateError }] = useMutation<UpdateData>(
    UPDATE_ENTITY,
    {
      onCompleted: (data) => {
        trackEvent({
          eventName: "updateEntity",
          entityName: data.updateEntity.displayName,
        });
        pendingChangesContext.addEntity(data.updateEntity.id);
      },
    }
  );

  const handleSubmit = useCallback(
    (data: Omit<models.Entity, "versionNumber">) => {
      /**@todo: check why the "fields" and "permissions" properties are not removed by omitDeep in the form */

      let {
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
      className="entity"
      sideContent={
        data && (
          <>
            <InnerTabLink
              to={`/${application}/entities/${data.entity.id}`}
              icon="settings"
            >
              General Settings
            </InnerTabLink>
            <InnerTabLink
              to={`/${application}/entities/${data.entity.id}/permissions`}
              icon="lock"
            >
              Permissions
            </InnerTabLink>
            <InnerTabLink
              to={`/${application}/entities/${data.entity.id}/fields`}
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
        <span>Loading...</span>
      ) : !data ? (
        <span>can't find</span> /**@todo: Show formatted error message */
      ) : (
        <Switch>
          <RouteWithAnalytics path="/:application/entities/:entityId/permissions">
            <PermissionsForm
              entityId={entityId}
              applicationId={application}
              availableActions={ENTITY_ACTIONS}
              objectDisplayName={data.entity.pluralDisplayName}
            />
          </RouteWithAnalytics>
          <RouteWithAnalytics path="/:application/entities/:entityId/fields/:fieldId">
            <EntityField />
          </RouteWithAnalytics>
          <RouteWithAnalytics path="/:application/entities/:entityId/fields/">
            <EntityFieldList entityId={data.entity.id} />
          </RouteWithAnalytics>
          <RouteWithAnalytics path="/:application/entities/:entityId">
            <EntityForm
              entity={data.entity}
              applicationId={application}
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
        unique
        searchable
        dataType
        description
      }
    }
  }
`;
