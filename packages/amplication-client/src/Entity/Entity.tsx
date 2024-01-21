import { CircularProgress, Snackbar } from "@amplication/ui/design-system";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useCallback, useContext } from "react";
import { Switch, match } from "react-router-dom";
import EntityField from "../Entity/EntityField";
import InnerTabLink from "../Layout/InnerTabLink";
import PageContent from "../Layout/PageContent";
import RouteWithAnalytics from "../Layout/RouteWithAnalytics";
import PermissionsForm from "../Permissions/PermissionsForm";
import * as models from "../models";
import { track } from "../util/analytics";
import { formatError } from "../util/error";
import { EntityFieldLinkList } from "./EntityFieldLinkList";
import EntityFieldList from "./EntityFieldList";
import EntityForm from "./EntityForm";
import { ENTITY_ACTIONS } from "./constants";

import { AppContext } from "../context/appContext";
import useModule from "../Modules/hooks/useModule";
import { DATE_CREATED_FIELD } from "../Modules/ModuleList";
import useBreadcrumbs from "../Layout/useBreadcrumbs";

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

  const { findModuleRefetch } = useModule();

  const { data, loading, error } = useQuery<TData>(GET_ENTITY, {
    variables: {
      id: entityId,
    },
  });

  const [updateEntity, { error: updateError }] = useMutation<UpdateData>(
    UPDATE_ENTITY,
    {
      onCompleted: (data) => {
        //refresh the modules list
        findModuleRefetch({
          where: {
            resource: { id: resource },
          },
          orderBy: {
            [DATE_CREATED_FIELD]: models.SortOrder.Asc,
          },
        });

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

  useBreadcrumbs(data?.entity.name, match.url);

  return (
    <PageContent
      pageTitle={data?.entity.displayName}
      className="entity"
      sideContent={
        data && (
          <>
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
              entityName={data.entity.name}
              resourceId={resource}
              availableActions={ENTITY_ACTIONS}
              objectDisplayName={data.entity.pluralDisplayName}
            />
          </RouteWithAnalytics>
          <RouteWithAnalytics path="/:workspace/:project/:resource/entities/:entityId/fields/:fieldId">
            <EntityField />
          </RouteWithAnalytics>
          <RouteWithAnalytics path="/:workspace/:project/:resource/entities/:entityId/fields/">
            <EntityFieldList
              entityId={data.entity.id}
              entityName={data.entity.name}
            />
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
