import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import { gql, useQuery } from "@apollo/client";
import { Snackbar } from "@rmwc/snackbar";
import { CircularProgress } from "@rmwc/circular-progress";
import { formatError } from "../util/error";
import * as models from "../models";
import { SearchField } from "@amplication/design-system";
import NewRole from "./NewRole";
import InnerTabLink from "../Layout/InnerTabLink";
import "./RoleList.scss";

type TData = {
  appRoles: models.AppRole[];
};

const DATE_CREATED_FIELD = "createdAt";
const CLASS_NAME = "role-list";

type Props = {
  applicationId: string;
  selectFirst?: boolean;
};

export const RoleList = React.memo(
  ({ applicationId, selectFirst = false }: Props) => {
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
        id: applicationId,
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
      (role: models.AppRole) => {
        const fieldUrl = `/${applicationId}/roles/${role.id}`;
        history.push(fieldUrl);
      },
      [history, applicationId]
    );

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.appRoles)) {
        console.log("role list effect - inside");
        const role = data.appRoles[0];
        const fieldUrl = `/${applicationId}/roles/${role.id}`;
        history.push(fieldUrl);
      }
    }, [data, selectFirst, applicationId, history]);

    return (
      <div className={CLASS_NAME}>
        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />
        <div className={`${CLASS_NAME}__header`}>
          {data?.appRoles.length} Roles
        </div>
        {loading && <CircularProgress />}
        {data?.appRoles?.map((role) => (
          <div key={role.id}>
            <InnerTabLink
              icon="roles"
              to={`/${applicationId}/roles/${role.id}`}
            >
              <span>{role.displayName}</span>
            </InnerTabLink>
          </div>
        ))}
        {data?.appRoles && (
          <NewRole onRoleAdd={handleRoleChange} applicationId={applicationId} />
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    );
  }
);

export const GET_ROLES = gql`
  query getRoles(
    $id: String!
    $orderBy: AppRoleOrderByInput
    $whereName: StringFilter
  ) {
    appRoles(
      where: { app: { id: $id }, displayName: $whereName }
      orderBy: $orderBy
    ) {
      id
      name
      displayName
      description
    }
  }
`;
