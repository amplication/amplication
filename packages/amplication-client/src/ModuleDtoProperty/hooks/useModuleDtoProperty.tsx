import { Reference, useLazyQuery, useMutation } from "@apollo/client";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_MODULE_DTO_PROPERTY,
  DELETE_MODULE_DTO_PROPERTY,
  FIND_MODULE_DTO_PROPERTIES,
  GET_MODULE_DTO_PROPERTY,
  UPDATE_MODULE_DTO_PROPERTY,
} from "../queries/moduleDtoPropertiesQueries";
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
  const { addBlock, addEntity } = useContext(AppContext);

  const [
    deleteModuleDtoProperty,
    {
      error: deleteModuleDtoPropertyError,
      loading: deleteModuleDtoPropertyLoading,
    },
  ] = useMutation<TDeleteData>(DELETE_MODULE_DTO_PROPERTY, {
    onCompleted: (data) => {
      addBlock(data.deleteModuleDtoProperty.id);
    },
  });

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
