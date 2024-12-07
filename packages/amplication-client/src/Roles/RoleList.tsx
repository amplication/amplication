import React, { useState, useCallback, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import { gql, useQuery } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import {
  SearchField,
  Snackbar,
  CircularProgress,
  Text,
  EnumTextStyle,
  FlexItem,
  EnumFlexItemMargin,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumGapSize,
} from "@amplication/ui/design-system";
import NewRole from "./NewRole";
import InnerTabLink from "../Layout/InnerTabLink";
import { pluralize } from "../util/pluralize";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

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

    const { baseUrl } = useResourceBaseUrl({
      overrideResourceId: resourceId,
    });

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
        const fieldUrl = `${baseUrl}/roles/${role.id}`;
        history.push(fieldUrl);
      },
      [history, baseUrl]
    );

    useEffect(() => {
      if (selectFirst && data && !isEmpty(data.resourceRoles)) {
        const role = data.resourceRoles[0];
        const fieldUrl = `${baseUrl}/roles/${role.id}`;
        history.push(fieldUrl);
      }
    }, [data, selectFirst, history, baseUrl]);

    return (
      <div className={CLASS_NAME}>
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <Text textStyle={EnumTextStyle.Tag}>
            {data?.resourceRoles.length}{" "}
            {pluralize(data?.resourceRoles.length, "Role", "Roles")}
          </Text>
        </FlexItem>

        <SearchField
          label="search"
          placeholder="search"
          onChange={handleSearchChange}
        />

        {loading && <CircularProgress centerToParent />}
        <FlexItem
          margin={EnumFlexItemMargin.Top}
          direction={EnumFlexDirection.Column}
          itemsAlign={EnumItemsAlign.Stretch}
          gap={EnumGapSize.None}
        >
          {data?.resourceRoles?.map((role) => (
            <InnerTabLink
              icon="roles"
              to={`${baseUrl}/roles/${role.id}`}
              key={role.id}
            >
              <span>{role.displayName}</span>
            </InnerTabLink>
          ))}
          {data?.resourceRoles && (
            <NewRole onRoleAdd={handleRoleChange} resourceId={resourceId} />
          )}
        </FlexItem>
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
