import { Reference, useLazyQuery, useMutation } from "@apollo/client";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_MODULE_DTO_PROPERTY,
  DELETE_MODULE_DTO_PROPERTY,
  FIND_MODULE_DTO_PROPERTIES,
  GET_MODULE_DTO_PROPERTY,
  MODULE_DTO_PROPERTY_FIELDS_FRAGMENT,
  UPDATE_MODULE_DTO_PROPERTY,
} from "../queries/moduleDtoPropertiesQueries";
import useModuleDto from "../../ModuleDto/hooks/useModuleDto";
type TDeleteData = {
  deleteModuleDtoProperty: models.ModuleDtoProperty;
};

type TFindData = {
  ModuleDtoProperties: models.ModuleDtoProperty[];
};

type TGetData = {
  ModuleDtoProperty: models.ModuleDtoProperty;
};

type TCreateData = {
  createModuleDtoProperty: models.ModuleDtoProperty;
};

type TUpdateData = {
  updateModuleDtoProperty: models.ModuleDtoProperty;
};

const useModuleDtoProperty = () => {
  const {
    addBlock,
    addEntity,
    currentWorkspace,
    currentProject,
    currentResource,
  } = useContext(AppContext);

  const { getModuleDtoRefetch } = useModuleDto();

  const history = useHistory();

  const [
    deleteModuleDtoProperty,
    {
      error: deleteModuleDtoPropertyError,
      loading: deleteModuleDtoPropertyLoading,
    },
  ] = useMutation<TDeleteData>(DELETE_MODULE_DTO_PROPERTY, {
    update(cache, { data }) {
      if (!data || data === undefined) return;
      const deletedModuleDtoPropertyId = data.deleteModuleDtoProperty.id;
      cache.modify({
        fields: {
          ModuleDtoProperties(existingModuleDtoPropertyRefs, { readField }) {
            return existingModuleDtoPropertyRefs.filter(
              (moduleRef: Reference) =>
                deletedModuleDtoPropertyId !== readField("id", moduleRef)
            );
          },
        },
      });
    },
    onCompleted: (data) => {
      addBlock(data.deleteModuleDtoProperty.id);
    },
  });

  const deleteCurrentModuleDtoProperty = (data: models.ModuleDtoProperty) => {
    deleteModuleDtoProperty({
      variables: {
        where: {
          id: data.id,
        },
      },
    })
      .then((result) => {
        history.push(
          `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/all`
        );
      })
      .catch(console.error);
  };

  const [
    createModuleDtoProperty,
    {
      data: createModuleDtoPropertyData,
      error: createModuleDtoPropertyError,
      loading: createModuleDtoPropertyLoading,
    },
  ] = useMutation<TCreateData>(CREATE_MODULE_DTO_PROPERTY, {
    onCompleted: (data) => {
      addBlock(data.createModuleDtoProperty.id);
      getModuleDtoRefetch({
        moduleDtoId: data.createModuleDtoProperty.parentBlockId,
      });
    },
    update(cache, { data }) {
      if (!data) return;

      const newModuleDtoProperty = data.createModuleDtoProperty;

      cache.modify({
        fields: {
          ModuleDtoProperties(
            existingModuleDtoPropertyRefs = [],
            { readField }
          ) {
            const newModuleDtoPropertyRef = cache.writeFragment({
              data: newModuleDtoProperty,
              fragment: MODULE_DTO_PROPERTY_FIELDS_FRAGMENT,
            });

            if (
              existingModuleDtoPropertyRefs.some(
                (moduleRef: Reference) =>
                  readField("id", moduleRef) === newModuleDtoProperty.id
              )
            ) {
              return existingModuleDtoPropertyRefs;
            }

            return [...existingModuleDtoPropertyRefs, newModuleDtoPropertyRef];
          },
        },
      });
    },
  });

  const [
    findModuleDtoProperties,
    {
      data: findModuleDtoPropertiesData,
      loading: findModuleDtoPropertiesLoading,
      error: findModuleDtoPropertiesError,
      refetch: findModuleDtoPropertyRefetch,
    },
  ] = useLazyQuery<TFindData>(FIND_MODULE_DTO_PROPERTIES, {});

  const [
    getModuleDtoProperty,
    {
      data: getModuleDtoPropertyData,
      error: getModuleDtoPropertyError,
      loading: getModuleDtoPropertyLoading,
      refetch: getModuleDtoPropertyRefetch,
    },
  ] = useLazyQuery<TGetData>(GET_MODULE_DTO_PROPERTY);

  const [
    updateModuleDtoProperty,
    {
      error: updateModuleDtoPropertyError,
      loading: updateModuleDtoPropertyLoading,
    },
  ] = useMutation<TUpdateData>(UPDATE_MODULE_DTO_PROPERTY, {
    onCompleted: (data) => {
      addEntity(data.updateModuleDtoProperty.id);
    },
  });

  return {
    deleteModuleDtoProperty,
    deleteCurrentModuleDtoProperty,
    deleteModuleDtoPropertyError,
    deleteModuleDtoPropertyLoading,
    createModuleDtoProperty,
    createModuleDtoPropertyData,
    createModuleDtoPropertyError,
    createModuleDtoPropertyLoading,
    findModuleDtoProperties,
    findModuleDtoPropertiesData,
    findModuleDtoPropertiesLoading,
    findModuleDtoPropertiesError,
    findModuleDtoPropertyRefetch,
    getModuleDtoProperty,
    getModuleDtoPropertyData,
    getModuleDtoPropertyError,
    getModuleDtoPropertyLoading,
    getModuleDtoPropertyRefetch,
    updateModuleDtoProperty,
    updateModuleDtoPropertyError,
    updateModuleDtoPropertyLoading,
  };
};

export default useModuleDtoProperty;
