import { useLazyQuery, useMutation } from "@apollo/client";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_MODULE_DTO,
  DELETE_MODULE_DTO,
  FIND_MODULE_DTOS,
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
  const { addBlock, addEntity } = useContext(AppContext);

  const [
    deleteModuleDto,
    { error: deleteModuleDtoError, loading: deleteModuleDtoLoading },
  ] = useMutation<TDeleteData>(DELETE_MODULE_DTO, {
    onCompleted: (data) => {
      addBlock(data.deleteModuleDto.id);
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
  };
};

export default useModuleDto;
