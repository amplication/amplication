import { Reference, useLazyQuery, useMutation } from "@apollo/client";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_MODULE_DTO,
  CREATE_MODULE_DTO_ENUM,
  CREATE_MODULE_DTO_PROPERTY,
  DELETE_MODULE_DTO,
  DELETE_MODULE_DTO_PROPERTY,
  FIND_MODULE_DTOS,
  GET_AVAILABLE_DTOS_FOR_RESOURCE,
  GET_MODULE_DTO,
  MODULE_DTO_FIELDS_FRAGMENT,
  UPDATE_MODULE_DTO,
  UPDATE_MODULE_DTO_PROPERTY,
} from "../queries/moduleDtosQueries";
type TDeleteData = {
  deleteModuleDto: models.ModuleDto;
};

type TDeletePropertyData = {
  deleteModuleDtoProperty: models.ModuleDtoProperty;
};

type TFindData = {
  moduleDtos: models.ModuleDto[];
};

type TGetData = {
  moduleDto: models.ModuleDto;
};

type TCreateData = {
  createModuleDto: models.ModuleDto;
};

type createModuleDtoEnum = {
  createModuleDtoEnum: models.ModuleDto;
};

type TCreatePropertyData = {
  createModuleDtoProperty: models.ModuleDtoProperty;
};

type TUpdateData = {
  updateModuleDto: models.ModuleDto;
};

type TUpdatePropertyData = {
  updateModuleDtoProperty: models.ModuleDtoProperty;
};

const useModuleDto = () => {
  const {
    addBlock,
    addEntity,
    currentResource,
    currentWorkspace,
    currentProject,
  } = useContext(AppContext);

  const [availableDtosDictionary, setAvailableDtosDictionary] = useState<
    Record<string, models.ModuleDto>
  >({});

  const getModuleDtoUrl = (dto: models.ModuleDto) => {
    return `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${dto.parentBlockId}/dtos/${dto.id}`;
  };

  const [
    deleteModuleDto,
    { error: deleteModuleDtoError, loading: deleteModuleDtoLoading },
  ] = useMutation<TDeleteData>(DELETE_MODULE_DTO, {
    update(cache, { data }) {
      if (!data) return;
      const deletedDtoId = data.deleteModuleDto.id;

      cache.modify({
        fields: {
          moduleDtos(existingDtoRefs, { readField }) {
            return existingDtoRefs.filter(
              (dtoRef: Reference) => deletedDtoId !== readField("id", dtoRef)
            );
          },
        },
      });
    },
    onCompleted: (data) => {
      addBlock(data.deleteModuleDto.id);
      getAvailableDtosForResourceRefetch();
    },
  });

  const [
    deleteModuleDtoProperty,
    {
      error: deleteModuleDtoPropertyError,
      loading: deleteModuleDtoPropertyLoading,
    },
  ] = useMutation<TDeletePropertyData>(DELETE_MODULE_DTO_PROPERTY, {
    onCompleted: (data) => {
      addBlock(data.deleteModuleDtoProperty.name);
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
    update(cache, { data }) {
      if (!data) return;

      const newModuleDto = data.createModuleDto;

      cache.modify({
        fields: {
          moduleDtos(existingModuleDtoRefs = [], { readField }) {
            const newModuleDtoRef = cache.writeFragment({
              data: newModuleDto,
              fragment: MODULE_DTO_FIELDS_FRAGMENT,
              fragmentName: "ModuleDtoFields",
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
    onCompleted: (data) => {
      addBlock(data.createModuleDto.id);
      getAvailableDtosForResourceRefetch();
    },
  });

  const [
    createModuleDtoEnum,
    {
      data: createModuleDtoEnumData,
      error: createModuleDtoEnumError,
      loading: createModuleDtoEnumLoading,
    },
  ] = useMutation<createModuleDtoEnum>(CREATE_MODULE_DTO_ENUM, {
    update(cache, { data }) {
      if (!data) return;

      const newModuleDto = data.createModuleDtoEnum;

      cache.modify({
        fields: {
          moduleDtos(existingModuleDtoRefs = [], { readField }) {
            const newModuleDtoRef = cache.writeFragment({
              data: newModuleDto,
              fragment: MODULE_DTO_FIELDS_FRAGMENT,
              fragmentName: "ModuleDtoFields",
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
    onCompleted: (data) => {
      addBlock(data.createModuleDtoEnum.id);
      getAvailableDtosForResourceRefetch();
    },
  });

  const [
    createModuleDtoProperty,
    {
      data: createModuleDtoPropertyData,
      error: createModuleDtoPropertyError,
      loading: createModuleDtoPropertyLoading,
    },
  ] = useMutation<TCreatePropertyData>(CREATE_MODULE_DTO_PROPERTY, {
    onCompleted: (data) => {
      addBlock(data.createModuleDtoProperty.name);
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
    }).then((result) => {
      if (result.data) {
        const dictionary = result.data.moduleDtos.reduce((acc, dto) => {
          acc[dto.id] = dto;
          return acc;
        }, {} as Record<string, models.ModuleDto>);
        setAvailableDtosDictionary(dictionary);
      }
    });
  }, [
    getAvailableDtosForResourceInternal,
    currentResource,
    setAvailableDtosDictionary,
  ]);

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

  const [
    updateModuleDtoProperty,
    {
      error: updateModuleDtoPropertyError,
      loading: updateModuleDtoPropertyLoading,
    },
  ] = useMutation<TUpdatePropertyData>(UPDATE_MODULE_DTO_PROPERTY, {
    onCompleted: (data) => {
      addEntity(data.updateModuleDtoProperty.name);
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
    availableDtosDictionary,
    createModuleDtoProperty,
    createModuleDtoPropertyData,
    createModuleDtoPropertyError,
    createModuleDtoPropertyLoading,
    updateModuleDtoProperty,
    updateModuleDtoPropertyError,
    updateModuleDtoPropertyLoading,
    deleteModuleDtoProperty,
    deleteModuleDtoPropertyError,
    deleteModuleDtoPropertyLoading,
    createModuleDtoEnum,
    createModuleDtoEnumData,
    createModuleDtoEnumError,
    createModuleDtoEnumLoading,
    getModuleDtoUrl,
  };
};

export default useModuleDto;
