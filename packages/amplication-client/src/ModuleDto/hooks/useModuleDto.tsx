import { Reference, useLazyQuery, useMutation } from "@apollo/client";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_MODULE_DTO,
  DELETE_MODULE_DTO,
  FIND_MODULE_DTOS,
  GET_MODULE_DTO,
  MODULE_DTO_FIELDS_FRAGMENT,
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
  const {
    addBlock,
    addEntity,
    currentWorkspace,
    currentProject,
    currentResource,
  } = useContext(AppContext);

  const history = useHistory();

  const [
    deleteModuleDto,
    { error: deleteModuleDtoError, loading: deleteModuleDtoLoading },
  ] = useMutation<TDeleteData>(DELETE_MODULE_DTO, {
    update(cache, { data }) {
      if (!data || data === undefined) return;
      const deletedModuleDtoId = data.deleteModuleDto.id;
      cache.modify({
        fields: {
          ModuleDtos(existingModuleDtoRefs, { readField }) {
            return existingModuleDtoRefs.filter(
              (moduleRef: Reference) =>
                deletedModuleDtoId !== readField("id", moduleRef)
            );
          },
        },
      });
    },
    onCompleted: (data) => {
      addBlock(data.deleteModuleDto.id);
    },
  });

  const deleteCurrentModuleDto = (data: models.ModuleDto) => {
    deleteModuleDto({
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
    createModuleDto,
    {
      data: createModuleDtoData,
      error: createModuleDtoError,
      loading: createModuleDtoLoading,
    },
  ] = useMutation<TCreateData>(CREATE_MODULE_DTO, {
    update(cache, { data }) {
      if (!data) return;

      const newModuleDto = data.createModuleDto;

      cache.modify({
        fields: {
          ModuleDtos(existingModuleDtoRefs = [], { readField }) {
            const newModuleDtoRef = cache.writeFragment({
              data: newModuleDto,
              fragment: MODULE_DTO_FIELDS_FRAGMENT,
            });

            if (
              existingModuleDtoRefs.some(
                (moduleRef: Reference) =>
                  readField("id", moduleRef) === newModuleDto.id
              )
            ) {
              return existingModuleDtoRefs;
            }

            return [...existingModuleDtoRefs, newModuleDtoRef];
          },
        },
      });
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
    deleteCurrentModuleDto,
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
