import { useLazyQuery, useMutation } from "@apollo/client";
import { useCallback, useContext, useEffect } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_MODULE_DTO,
  DELETE_MODULE_DTO,
  FIND_MODULE_DTOS,
  GET_AVAILABLE_DTOS_FOR_RESOURCE,
  GET_MODULE_DTO,
  UPDATE_MODULE_DTO,
} from "../queries/moduleDtosQueries";
type TDeleteData = {
  deleteModuleDto: models.ModuleDto;
};

type TFindData = {
  ModuleDtos: models.ModuleDto[];
};

type TGetData = {
  ModuleDto: models.ModuleDto;
};

type TCreateData = {
  createModuleDto: models.ModuleDto;
};

type TUpdateData = {
  updateModuleDto: models.ModuleDto;
};

const useModuleDto = () => {
  const { addBlock, addEntity, currentResource } = useContext(AppContext);

  const [
    deleteModuleDto,
    { error: deleteModuleDtoError, loading: deleteModuleDtoLoading },
  ] = useMutation<TDeleteData>(DELETE_MODULE_DTO, {
    onCompleted: (data) => {
      addBlock(data.deleteModuleDto.id);
      getAvailableDtosForResourceRefetch();
    },
  });

  const [
    createModuleDto,
    {
      data: createModuleDtoData,
      error: createModuleDtoError,
      loading: createModuleDtoLoading,
    },
  ] = useMutation<TCreateData>(CREATE_MODULE_DTO, {
    onCompleted: (data) => {
      addBlock(data.createModuleDto.id);
      getAvailableDtosForResourceRefetch();
    },
  });

  const [
    findModuleDtos,
    {
      data: findModuleDtosData,
      loading: findModuleDtosLoading,
      error: findModuleDtosError,
      refetch: findModuleDtoRefetch,
    },
  ] = useLazyQuery<TFindData>(FIND_MODULE_DTOS, {});

  const [
    getAvailableDtosForResourceInternal,
    {
      data: availableDtosForCurrentResource,
      loading: availableDtosForCurrentResourceLoading,
      error: availableDtosForCurrentResourceError,
      refetch: getAvailableDtosForResourceRefetch,
    },
  ] = useLazyQuery<TFindData>(GET_AVAILABLE_DTOS_FOR_RESOURCE, {});

  const getAvailableDtosForCurrentResource = useCallback(() => {
    getAvailableDtosForResourceInternal({
      variables: {
        where: {
          resource: {
            id: currentResource?.id,
          },
        },
      },
    });
  }, [getAvailableDtosForResourceInternal, currentResource]);

  const [
    getModuleDto,
    {
      data: getModuleDtoData,
      error: getModuleDtoError,
      loading: getModuleDtoLoading,
      refetch: getModuleDtoRefetch,
    },
  ] = useLazyQuery<TGetData>(GET_MODULE_DTO);

  const [
    updateModuleDto,
    { error: updateModuleDtoError, loading: updateModuleDtoLoading },
  ] = useMutation<TUpdateData>(UPDATE_MODULE_DTO, {
    onCompleted: (data) => {
      addEntity(data.updateModuleDto.id);
    },
  });

  useEffect(() => {
    if (!currentResource) return;
    getAvailableDtosForCurrentResource();
  }, [getAvailableDtosForCurrentResource, currentResource]);

  return {
    deleteModuleDto,
    deleteModuleDtoError,
    deleteModuleDtoLoading,
    createModuleDto,
    createModuleDtoData,
    createModuleDtoError,
    createModuleDtoLoading,
    findModuleDtos,
    findModuleDtosData,
    findModuleDtosLoading,
    findModuleDtosError,
    findModuleDtoRefetch,
    getModuleDto,
    getModuleDtoData,
    getModuleDtoError,
    getModuleDtoLoading,
    getModuleDtoRefetch,
    updateModuleDto,
    updateModuleDtoError,
    updateModuleDtoLoading,
    availableDtosForCurrentResource,
    availableDtosForCurrentResourceLoading,
    availableDtosForCurrentResourceError,
  };
};

export default useModuleDto;
