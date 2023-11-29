import { Reference, useLazyQuery, useMutation } from "@apollo/client";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
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
  Modules: models.Module[];
};

type TGetData = {
  Module: models.Module;
};

type TCreateData = {
  createModule: models.Module;
};

type TUpdateData = {
  updateModule: models.Module;
};

const useModule = () => {
  const { addBlock, addEntity } = useContext(AppContext);

  const [
    deleteModule,
    { error: deleteModuleError, loading: deleteModuleLoading },
  ] = useMutation<TDeleteData>(DELETE_MODULE, {
    update(cache, { data }) {
      if (!data || data === undefined) return;
      const deletedModuleId = data.deleteModule.id;
      cache.modify({
        fields: {
          Modules(existingModuleRefs, { readField }) {
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
          Modules(existingModuleRefs = [], { readField }) {
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

  const [
    findModules,
    {
      data: findModulesData,
      loading: findModulesLoading,
      error: findModulesError,
      refetch: findModuleRefetch,
    },
  ] = useLazyQuery<TFindData>(FIND_MODULES, {});

  const [
    getModule,
    {
      data: getModuleData,
      error: getModuleError,
      loading: getModuleLoading,
      refetch: getModuleRefetch,
    },
  ] = useLazyQuery<TGetData>(GET_MODULE);

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
    findModules,
    findModulesData,
    findModulesLoading,
    findModulesError,
    findModuleRefetch,
    getModule,
    getModuleData,
    getModuleError,
    getModuleLoading,
    getModuleRefetch,
    updateModule,
    updateModuleError,
    updateModuleLoading,
  };
};

export default useModule;
