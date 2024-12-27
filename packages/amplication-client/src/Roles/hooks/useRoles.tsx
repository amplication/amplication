import { Reference, useMutation, useQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import * as models from "../../models";
import {
  ADD_PERMISSIONS_TO_ROLE,
  CREATE_ROLE,
  DELETE_ROLE,
  FIND_ROLES,
  GET_ROLE,
  REMOVE_PERMISSIONS_FROM_ROLE,
  ROLE_FIELDS_FRAGMENT,
  UPDATE_ROLE,
} from "../queries/rolesQueries";

type TDeleteData = {
  deleteRole: models.Role;
};

type TFindData = {
  roles: models.Role[];
};

type TGetData = {
  role: models.Role;
};

type TCreateData = {
  createRole: models.Role;
};

type TUpdateData = {
  updateRole: models.Role;
};

const NAME_FIELD = "name";

const useRoles = (roleId?: string) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [deleteRole, { error: deleteRoleError, loading: deleteRoleLoading }] =
    useMutation<TDeleteData>(DELETE_ROLE, {
      update(cache, { data }) {
        if (!data || data === undefined) return;
        const deletedRoleId = data.deleteRole.id;

        cache.evict({
          id: cache.identify({ __typename: "Role", id: deletedRoleId }),
        });

        cache.gc();
      },
    });

  const [
    createRole,
    {
      data: createRoleData,
      error: createRoleError,
      loading: createRoleLoading,
    },
  ] = useMutation<TCreateData>(CREATE_ROLE, {
    update(cache, { data }) {
      if (!data) return;

      const newRole = data.createRole;

      cache.modify({
        fields: {
          roles(existingRoleRefs = [], { readField }) {
            const newRoleRef = cache.writeFragment({
              data: newRole,
              fragment: ROLE_FIELDS_FRAGMENT,
            });

            if (
              existingRoleRefs.some(
                (roleRef: Reference) => readField("id", roleRef) === newRole.id
              )
            ) {
              return existingRoleRefs;
            }

            return [...existingRoleRefs, newRoleRef];
          },
        },
      });
    },
  });

  const {
    data: findRolesData,
    loading: findRolesLoading,
    error: findRolesError,
    refetch: findRoleRefetch,
  } = useQuery<TFindData>(FIND_ROLES, {
    variables: {
      where: {
        name:
          searchPhrase !== ""
            ? {
                contains: searchPhrase,
                mode: models.QueryMode.Insensitive,
              }
            : undefined,
      },
      orderBy: {
        [NAME_FIELD]: models.SortOrder.Asc,
      },
    },
  });

  const {
    data: getRoleData,
    error: getRoleError,
    loading: getRoleLoading,
    refetch: getRoleRefetch,
  } = useQuery<TGetData>(GET_ROLE, {
    variables: {
      roleId,
    },
    skip: !roleId,
  });

  const [updateRole, { error: updateRoleError, loading: updateRoleLoading }] =
    useMutation<TUpdateData>(UPDATE_ROLE, {});

  const [
    addPermissionsToRoleInternal,
    { error: addPermissionsToRoleError, loading: addPermissionsToRoleLoading },
  ] = useMutation<TUpdateData>(ADD_PERMISSIONS_TO_ROLE, {});

  const addPermissionsToRole = useCallback(
    (permissions: string[]) => {
      addPermissionsToRoleInternal({
        variables: {
          where: {
            id: roleId,
          },
          data: {
            permissions,
          },
        },
      })
        .then(() => {
          getRoleRefetch();
        })
        .catch(console.error);
    },
    [addPermissionsToRoleInternal, roleId, getRoleRefetch]
  );

  const [
    removePermissionsFromRoleInternal,
    {
      error: removePermissionsFromRoleError,
      loading: removePermissionsFromRoleLoading,
    },
  ] = useMutation<TUpdateData>(REMOVE_PERMISSIONS_FROM_ROLE, {});

  const removePermissionsFromRole = useCallback(
    (permissions: string[]) => {
      removePermissionsFromRoleInternal({
        variables: {
          where: {
            id: roleId,
          },
          data: {
            permissions,
          },
        },
      })
        .then(() => {
          getRoleRefetch();
        })
        .catch(console.error);
    },
    [removePermissionsFromRoleInternal, roleId, getRoleRefetch]
  );

  return {
    deleteRole,
    deleteRoleError,
    deleteRoleLoading,
    createRole,
    createRoleData,
    createRoleError,
    createRoleLoading,
    findRolesData,
    findRolesLoading,
    findRolesError,
    findRoleRefetch,
    getRoleData,
    getRoleError,
    getRoleLoading,
    getRoleRefetch,
    updateRole,
    updateRoleError,
    updateRoleLoading,
    setSearchPhrase,
    addPermissionsToRole,
    addPermissionsToRoleError,
    addPermissionsToRoleLoading,
    removePermissionsFromRole,
    removePermissionsFromRoleError,
    removePermissionsFromRoleLoading,
  };
};

export default useRoles;
