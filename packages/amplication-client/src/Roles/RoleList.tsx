import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import {
  SearchField,
  Snackbar,
  CircularProgress,
} from "@amplication/design-system";
import NewRole from "./NewRole";
import InnerTabLink from "../Layout/InnerTabLink";
import "./RoleList.scss";

type TData = {
  resourceRoles: models.ResourceRole[];
};

const DATE_CREATED_FIELD = "createdAt";
const CLASS_NAME = "role-list";

type Props = {
  resourceId: string;
  selectFirst?: boolean;
};

export const RoleList = React.memo(
  ({ resourceId, selectFirst = false }: Props) => {
    const [searchPhrase, setSearchPhrase] = useState<string>("");

    const handleSearchChange = useCallback(
      (value) => {
        setSearchPhrase(value);
      },
      [setSearchPhrase]
    );
    const history = useHistory();

    const { data, loading, error } = useQuery<TData>(GET_ROLES, {
      variables: {
        id: resourceId,
        orderBy: {
          [DATE_CREATED_FIELD]: models.SortOrder.Asc,
        },
        whereName:
          searchPhrase !== ""
            ? {
                contains: searchPhrase,
                mode: models.QueryMode.Insensitive,
              }
            : undefined,
      },
    });

    const errorMessage = formatError(error);

    const handleRoleChange = useCallback(
      (role: models.ResourceRole) => {
        const fieldUrl = `/${resourceId}/roles/${role.id}`;
        history.push(fieldUrl);
      },
      [history, resourceId]
    );

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.resourceRoles)) {
        console.log("role list effect - inside");
        const role = data.resourceRoles[0];
        const fieldUrl = `/${resourceId}/roles/${role.id}`;
        history.push(fieldUrl);
      }
    }, [data, selectFirst, resourceId, history]);

    return (
      <div className={CLASS_NAME}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />
        <div className={`${CLASS_NAME}__header`}>
          {data?.resourceRoles.length} Roles
        </div>
        {loading && <CircularProgress />}
        {data?.resourceRoles?.map((role) => (
          <div key={role.id}>
            <InnerTabLink icon="roles" to={`/${resourceId}/roles/${role.id}`}>
              <span>{role.displayName}</span>
            </InnerTabLink>
          </div>
        ))}
        {data?.resourceRoles && (
          <NewRole onRoleAdd={handleRoleChange} resourceId={resourceId} />
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);

export const GET_ROLES = gql`
  query getRoles(
    $id: String!
    $orderBy: ResourceRoleOrderByInput
    $whereName: StringFilter
  ) {
    resourceRoles(
      where: { resource: { id: $id }, displayName: $whereName }
      orderBy: $orderBy
    ) {
      id
      name
      displayName
      description
    }
  }
`;
