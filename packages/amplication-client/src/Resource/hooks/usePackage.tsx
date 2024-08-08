import { Reference, useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_PACKAGE,
  DELETE_PACKAGE,
  FIND_PACKAGES,
  GET_PACKAGE,
  PACKAGE_FIELDS_FRAGMENT,
  UPDATE_PACKAGE,
} from "./packagesQueries";

type TCreateData = {
  createPackage: models.Package;
};

type TFindData = {
  packageList: models.Package[];
};

type TGetData = {
  package: models.Package;
};

type TUpdateData = {
  updatePackage: models.Package;
};

type TDeleteData = {
  deletePackage: models.Package;
};
const DATE_CREATED_FIELD = "createdAt";

const usePackage = (packageId?: string) => {
  const { currentResource, addBlock } = useContext(AppContext);
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [
    createPackage,
    {
      data: createPackageData,
      error: createPackageError,
      loading: createPackageLoading,
    },
  ] = useMutation<TCreateData>(CREATE_PACKAGE, {
    update(cache, { data }) {
      if (!data) return;

      const newPackage = data.createPackage;

      cache.modify({
        fields: {
          packages(existingPackageRefs = [], { readField }) {
            const newPackageRef = cache.writeFragment({
              data: newPackage,
              fragment: PACKAGE_FIELDS_FRAGMENT,
            });

            if (
              existingPackageRefs.some(
                (packageRef: Reference) =>
                  readField("id", packageRef) === newPackage.id
              )
            ) {
              return existingPackageRefs;
            }

            return [...existingPackageRefs, newPackageRef];
          },
        },
      });
    },
  });

  const {
    data: findPackagesData,
    loading: findPackagesLoading,
    error: findPackagesError,
    refetch: findPackagesRefetch,
  } = useQuery<TFindData>(FIND_PACKAGES, {
    variables: {
      where: {
        resource: { id: currentResource.id },
        displayName:
          searchPhrase !== ""
            ? {
                contains: searchPhrase,
                mode: models.QueryMode.Insensitive,
              }
            : undefined,
      },
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },
  });

  const {
    data: getPackageData,
    error: getPackageError,
    loading: getPackageLoading,
    refetch: getPackageRefetch,
  } = useQuery<TGetData>(GET_PACKAGE, {
    variables: {
      packageId,
    },
    skip: !packageId,
  });

  const [
    updatePackage,
    { error: updatePackageError, loading: updatePackageLoading },
  ] = useMutation<TUpdateData>(UPDATE_PACKAGE, {});

  const [
    deletePackage,
    { error: deletePackageError, loading: deletePackageLoading },
  ] = useMutation<TDeleteData>(DELETE_PACKAGE, {
    update(cache, { data }) {
      if (!data || data === undefined) return;
      const deletedPackageId = data.deletePackage.id;
      cache.modify({
        fields: {
          packages(existingPackageRefs, { readField }) {
            return existingPackageRefs.filter(
              (packageRef: Reference) =>
                deletedPackageId !== readField("id", packageRef)
            );
          },
        },
      });
    },

    onCompleted: (data) => {
      addBlock(data.deletePackage.id);
    },
  });

  return {
    createPackage,
    createPackageData,
    createPackageError,
    createPackageLoading,
    findPackagesData,
    findPackagesLoading,
    findPackagesError,
    findPackagesRefetch,
    getPackageData,
    getPackageError,
    getPackageLoading,
    getPackageRefetch,
    updatePackage,
    updatePackageError,
    updatePackageLoading,
    deletePackage,
    deletePackageError,
    deletePackageLoading,
    setSearchPhrase,
  };
};

export default usePackage;
