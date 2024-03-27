import { Reference, useMutation, useQuery } from "@apollo/client";
import { useContext, useState } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { DATE_CREATED_FIELD } from "../ModuleNavigationList";
import {
  CREATE_MODULE,
  DELETE_MODULE,
  FIND_MODULES,
  GET_MODULE,
  MODULE_FIELDS_FRAGMENT,
  UPDATE_MODULE,
} from "../queries/modulesQueries";
type TDeleteData = {
  deleteModule: models.Module;
};

type TFindData = {
  modules: models.Module[];
};

type TGetData = {
  module: models.Module;
};

type TCreateData = {
  createModule: models.Module;
};

type TUpdateData = {
  updateModule: models.Module;
};

const useModule = (moduleId?: string) => {
  const { addBlock, addEntity, currentResource } = useContext(AppContext);
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [
    deleteModule,
    { error: deleteModuleError, loading: deleteModuleLoading },
  ] = useMutation<TDeleteData>(DELETE_MODULE, {
    update(cache, { data }) {
      if (!data || data === undefined) return;
      const deletedModuleId = data.deleteModule.id;
      cache.modify({
        fields: {
          modules(existingModuleRefs, { readField }) {
            return existingModuleRefs.filter(
              (moduleRef: Reference) =>
                deletedModuleId !== readField("id", moduleRef)
            );
          },
        },
      });
    },

    onCompleted: (data) => {
      addBlock(data.deleteModule.id);
    },
  });

  const [
    createModule,
    {
      data: createModuleData,
      error: createModuleError,
      loading: createModuleLoading,
    },
  ] = useMutation<TCreateData>(CREATE_MODULE, {
    update(cache, { data }) {
      if (!data) return;

      const newModule = data.createModule;

      cache.modify({
        fields: {
          modules(existingModuleRefs = [], { readField }) {
            const newModuleRef = cache.writeFragment({
              data: newModule,
              fragment: MODULE_FIELDS_FRAGMENT,
            });

            if (
              existingModuleRefs.some(
                (moduleRef: Reference) =>
                  readField("id", moduleRef) === newModule.id
              )
            ) {
              return existingModuleRefs;
            }

            return [...existingModuleRefs, newModuleRef];
          },
        },
      });
    },
  });

  const {
    data: findModulesData,
    loading: findModulesLoading,
    error: findModulesError,
    refetch: findModuleRefetch,
  } = useQuery<TFindData>(FIND_MODULES, {
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
    data: getModuleData,
    error: getModuleError,
    loading: getModuleLoading,
    refetch: getModuleRefetch,
  } = useQuery<TGetData>(GET_MODULE, {
    variables: {
      moduleId,
    },
    skip: !moduleId,
  });

  const [
    updateModule,
    { error: updateModuleError, loading: updateModuleLoading },
  ] = useMutation<TUpdateData>(UPDATE_MODULE, {
    onCompleted: (data) => {
      addEntity(data.updateModule.id);
    },
  });

  return {
    deleteModule,
    deleteModuleError,
    deleteModuleLoading,
    createModule,
    createModuleData,
    createModuleError,
    createModuleLoading,
    findModulesData,
    findModulesLoading,
    findModulesError,
    findModuleRefetch,
    getModuleData,
    getModuleError,
    getModuleLoading,
    getModuleRefetch,
    updateModule,
    updateModuleError,
    updateModuleLoading,
    setSearchPhrase,
  };
};

export default useModule;
