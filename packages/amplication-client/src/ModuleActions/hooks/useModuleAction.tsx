import { Reference, useLazyQuery, useMutation } from "@apollo/client";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_MODULE_ACTION,
  DELETE_MODULE_ACTION,
  FIND_MODULE_ACTIONS,
  GET_MODULE_ACTION,
  MODULE_ACTION_FIELDS_FRAGMENT,
  UPDATE_MODULE_ACTION,
} from "../queries/moduleActionsQueries";
type TDeleteData = {
  deleteModuleAction: models.ModuleAction;
};

type TFindData = {
  moduleActions: models.ModuleAction[];
};

type TGetData = {
  moduleAction: models.ModuleAction;
};

type TCreateData = {
  createModuleAction: models.ModuleAction;
};

type TUpdateData = {
  updateModuleAction: models.ModuleAction;
};

const useModuleAction = () => {
  const { addBlock, addEntity } = useContext(AppContext);

  const [
    deleteModuleAction,
    { error: deleteModuleActionError, loading: deleteModuleActionLoading },
  ] = useMutation<TDeleteData>(DELETE_MODULE_ACTION, {
    update(cache, { data }) {
      if (!data || data === undefined) return;
      const deletedModuleActionId = data.deleteModuleAction.id;
      cache.modify({
        fields: {
          moduleActions(existingModuleActionRefs, { readField }) {
            return existingModuleActionRefs.filter(
              (moduleRef: Reference) =>
                deletedModuleActionId !== readField("id", moduleRef)
            );
          },
        },
      });
    },
    onCompleted: (data) => {
      addBlock(data.deleteModuleAction.id);
    },
  });

  const [
    createModuleAction,
    {
      data: createModuleActionData,
      error: createModuleActionError,
      loading: createModuleActionLoading,
    },
  ] = useMutation<TCreateData>(CREATE_MODULE_ACTION, {
    update(cache, { data }) {
      if (!data) return;

      const newModuleAction = data.createModuleAction;

      cache.modify({
        fields: {
          moduleActions(existingModuleActionRefs = [], { readField }) {
            const newModuleActionRef = cache.writeFragment({
              data: newModuleAction,
              fragment: MODULE_ACTION_FIELDS_FRAGMENT,
            });

            if (
              existingModuleActionRefs.some(
                (moduleRef: Reference) =>
                  readField("id", moduleRef) === newModuleAction.id
              )
            ) {
              return existingModuleActionRefs;
            }

            return [...existingModuleActionRefs, newModuleActionRef];
          },
        },
      });
    },
  });

  const [
    findModuleActions,
    {
      data: findModuleActionsData,
      loading: findModuleActionsLoading,
      error: findModuleActionsError,
      refetch: findModuleActionRefetch,
    },
  ] = useLazyQuery<TFindData>(FIND_MODULE_ACTIONS, {});

  const [
    getModuleAction,
    {
      data: getModuleActionData,
      error: getModuleActionError,
      loading: getModuleActionLoading,
      refetch: getModuleActionRefetch,
    },
  ] = useLazyQuery<TGetData>(GET_MODULE_ACTION);

  const [
    updateModuleAction,
    { error: updateModuleActionError, loading: updateModuleActionLoading },
  ] = useMutation<TUpdateData>(UPDATE_MODULE_ACTION, {
    onCompleted: (data) => {
      addEntity(data.updateModuleAction.id);
    },
  });

  return {
    deleteModuleAction,
    deleteModuleActionError,
    deleteModuleActionLoading,
    createModuleAction,
    createModuleActionData,
    createModuleActionError,
    createModuleActionLoading,
    findModuleActions,
    findModuleActionsData,
    findModuleActionsLoading,
    findModuleActionsError,
    findModuleActionRefetch,
    getModuleAction,
    getModuleActionData,
    getModuleActionError,
    getModuleActionLoading,
    getModuleActionRefetch,
    updateModuleAction,
    updateModuleActionError,
    updateModuleActionLoading,
  };
};

export default useModuleAction;
