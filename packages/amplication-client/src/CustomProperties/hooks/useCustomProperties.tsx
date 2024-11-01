import { Reference, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import * as models from "../../models";
import {
  CREATE_CUSTOM_PROPERTY,
  CUSTOM_PROPERTY_FIELDS_FRAGMENT,
  DELETE_CUSTOM_PROPERTY,
  FIND_CUSTOM_PROPERTIES,
  GET_CUSTOM_PROPERTY,
  UPDATE_CUSTOM_PROPERTY,
} from "../queries/customPropertiesQueries";

type TDeleteData = {
  deleteCustomProperty: models.CustomProperty;
};

type TFindData = {
  customProperties: models.CustomProperty[];
};

type TGetData = {
  customProperty: models.CustomProperty;
};

type TCreateData = {
  createCustomProperty: models.CustomProperty;
};

type TUpdateData = {
  updateCustomProperty: models.CustomProperty;
};

const NAME_FIELD = "name";

const useCustomProperties = (customPropertyId?: string) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [
    deleteCustomProperty,
    { error: deleteCustomPropertyError, loading: deleteCustomPropertyLoading },
  ] = useMutation<TDeleteData>(DELETE_CUSTOM_PROPERTY, {
    update(cache, { data }) {
      if (!data || data === undefined) return;
      const deletedCustomPropertyId = data.deleteCustomProperty.id;
      cache.modify({
        fields: {
          customProperties(existingCustomPropertyRefs, { readField }) {
            return existingCustomPropertyRefs.filter(
              (customPropertyRef: Reference) =>
                deletedCustomPropertyId !== readField("id", customPropertyRef)
            );
          },
        },
      });
    },
  });

  const [
    createCustomProperty,
    {
      data: createCustomPropertyData,
      error: createCustomPropertyError,
      loading: createCustomPropertyLoading,
    },
  ] = useMutation<TCreateData>(CREATE_CUSTOM_PROPERTY, {
    update(cache, { data }) {
      if (!data) return;

      const newCustomProperty = data.createCustomProperty;

      cache.modify({
        fields: {
          customProperties(existingCustomPropertyRefs = [], { readField }) {
            const newCustomPropertyRef = cache.writeFragment({
              data: newCustomProperty,
              fragment: CUSTOM_PROPERTY_FIELDS_FRAGMENT,
            });

            if (
              existingCustomPropertyRefs.some(
                (customPropertyRef: Reference) =>
                  readField("id", customPropertyRef) === newCustomProperty.id
              )
            ) {
              return existingCustomPropertyRefs;
            }

            return [...existingCustomPropertyRefs, newCustomPropertyRef];
          },
        },
      });
    },
  });

  const {
    data: findCustomPropertiesData,
    loading: findCustomPropertiesLoading,
    error: findCustomPropertiesError,
    refetch: findCustomPropertyRefetch,
  } = useQuery<TFindData>(FIND_CUSTOM_PROPERTIES, {
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
    data: getCustomPropertyData,
    error: getCustomPropertyError,
    loading: getCustomPropertyLoading,
    refetch: getCustomPropertyRefetch,
  } = useQuery<TGetData>(GET_CUSTOM_PROPERTY, {
    variables: {
      customPropertyId,
    },
    skip: !customPropertyId,
  });

  const [
    updateCustomProperty,
    { error: updateCustomPropertyError, loading: updateCustomPropertyLoading },
  ] = useMutation<TUpdateData>(UPDATE_CUSTOM_PROPERTY, {});

  return {
    deleteCustomProperty,
    deleteCustomPropertyError,
    deleteCustomPropertyLoading,
    createCustomProperty,
    createCustomPropertyData,
    createCustomPropertyError,
    createCustomPropertyLoading,
    findCustomPropertiesData,
    findCustomPropertiesLoading,
    findCustomPropertiesError,
    findCustomPropertyRefetch,
    getCustomPropertyData,
    getCustomPropertyError,
    getCustomPropertyLoading,
    getCustomPropertyRefetch,
    updateCustomProperty,
    updateCustomPropertyError,
    updateCustomPropertyLoading,
    setSearchPhrase,
  };
};

export default useCustomProperties;
